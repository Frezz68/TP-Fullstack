import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Cart } from '../../models/cart.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CheckoutComponent implements OnInit {
  cart: Cart = { items: [], totalAmount: 0 };
  checkoutForm: FormGroup;
  submitted = false;
  isLoading = false;
  orderCompleted = false;
  orderNumber = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      saveInfo: [false]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      
      // Rediriger si le panier est vide
      if (cart.items.length === 0 && !this.orderCompleted) {
        this.router.navigate(['/cart']);
      }
    });
    
    // Pré-remplir le formulaire si l'utilisateur est connecté
    if (this.authService.isLoggedIn) {
      this.authService.getProfile().subscribe({
        next: (user) => {
          this.checkoutForm.patchValue({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            address: user.address,
            phone: user.phone
          });
        }
      });
    }
  }

  get f() {
    return this.checkoutForm.controls;
  }

  placeOrder(): void {
    this.submitted = true;
    
    if (this.checkoutForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    if (!this.authService.isLoggedIn || this.checkoutForm.value.saveInfo) {
      const userData = {
        firstname: this.checkoutForm.value.firstname,
        lastname: this.checkoutForm.value.lastname,
        email: this.checkoutForm.value.email,
        address: this.checkoutForm.value.address,
        phone: this.checkoutForm.value.phone
      };
      
      if (!this.authService.isLoggedIn) {
        this.authService.register({
          ...userData,
          password: 'password123'
        }).subscribe({
          next: (user) => {
            this.authService.login(user.email, 'password123').subscribe({
              next: () => this.finalizeOrder(),
              error: (error) => {
                console.error('Erreur lors de la connexion', error);
                this.isLoading = false;
              }
            });
          },
          error: (error) => {
            console.error('Erreur lors de l\'inscription', error);
            this.isLoading = false;
          }
        });
      } else if (this.checkoutForm.value.saveInfo) {
        this.authService.updateProfile(userData).subscribe({
          next: () => this.finalizeOrder(),
          error: (error) => {
            console.error('Erreur lors de la mise à jour du profil', error);
            this.isLoading = false;
          }
        });
      } else {
        this.finalizeOrder();
      }
    } else {
      this.finalizeOrder();
    }
  }

  private finalizeOrder(): void {
    this.orderService.createOrder(this.cart.items).subscribe({
      next: (order) => {
        this.orderNumber = order.id.toString();
        this.orderCompleted = true;
        this.cartService.clearCart();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la création de la commande', error);
        this.isLoading = false;
      }
    });
  }
}
