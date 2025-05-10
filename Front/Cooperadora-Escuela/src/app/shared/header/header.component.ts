import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuProfile: any;
  isAdminUser: boolean = false;
  cartItemCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.menuProfile = user;
      this.isAdminUser = user?.is_staff || false;
    });

    this.cartService.cart$.subscribe((cart: Product[]) => {
      this.cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    });
  }


  logout(): void {
      this.authService.logout();
    this.menuProfile = null;
    this.router.navigate(['/login']); // redirige al login tras cerrar sesión
  }
  

  getUserProfile(): void {
    this.authService.getUs().subscribe({
      next: (user) => this.menuProfile = user,
      error: (err) => console.error('Error al obtener el usuario', err)
    });
   }
}
