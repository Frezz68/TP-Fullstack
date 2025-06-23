import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({ items: [], totalAmount: 0 });
  public cart$ = this.cartSubject.asObservable();

  constructor() { 
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartSubject.next(JSON.parse(storedCart));
    }
  }

  get cart(): Cart {
    return this.cartSubject.value;
  }

  get itemCount(): number {
    return this.cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {

      const updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      
      this.updateCart({ ...currentCart, items: updatedItems });
    } else {

      this.updateCart({
        ...currentCart,
        items: [...currentCart.items, { product, quantity }]
      });
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(item => item.product.id === productId);

    if (existingItemIndex !== -1) {
      const updatedItems = [...currentCart.items];
      
      if (quantity <= 0) {

        updatedItems.splice(existingItemIndex, 1);
      } else {

        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity
        };
      }
      
      this.updateCart({ ...currentCart, items: updatedItems });
    }
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.filter(item => item.product.id !== productId);
    
    this.updateCart({ ...currentCart, items: updatedItems });
  }

  clearCart(): void {
    this.updateCart({ items: [], totalAmount: 0 });
  }

  private updateCart(cart: Cart): void {
    
    const totalAmount = cart.items.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
    
    const updatedCart = { ...cart, totalAmount };
    
    
    this.cartSubject.next(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }
}
