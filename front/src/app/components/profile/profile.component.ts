import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  orders: Order[] = [];
  profileForm: FormGroup;
  submitted = false;
  isLoading = false;
  updateSuccess = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private orderService: OrderService
  ) {
    this.profileForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserOrders();
  }

  get f() {
    return this.profileForm.controls;
  }

  loadUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          address: user.address,
          phone: user.phone
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil', error);
      }
    });
  }

  loadUserOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes', error);
      }
    });
  }

  updateProfile(): void {
    this.submitted = true;
    
    if (this.profileForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.updateSuccess = false;
    
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
        this.updateSuccess = true;
        
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil', error);
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  }
}
