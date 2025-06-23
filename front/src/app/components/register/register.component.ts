import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  isLoading = false;
  registerError = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      phone: ['']
    });
    
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.registerError = '';
    
    if (this.registerForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.authService.login(
          this.registerForm.value.email,
          this.registerForm.value.password
        ).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: () => {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error) => {
        this.registerError = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }
}
