import { Component, OnInit, DestroyRef } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent implements OnInit {
  products: Product[] = [];
  product: Product = { id: 0, name: '', price: 0, image: '' };
  isAdminUser: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private destroyRef: DestroyRef,
    private cartService: CartService, 
    private authService: AuthService,
    private titleService: Title
  ) {  this.titleService.setTitle('Productos - Cooperadora Escolar');}

  ngOnInit(): void {
    this.loadProducts(); 
    this.authService.currentUser$.subscribe(user => {
      this.isAdminUser = user?.is_staff || false;
    });
  }

  
  loadProducts() {
    this.productService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Product[]) => {
          this.products = data;
        },
        error: (error) => {
          console.error('Error al cargar los productos:', error);
        },
      });
  }

 
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} ha sido agregado al carrito.`);
  }

  
  deleteProduct(id: number) {
    this.productService.deleteProduct(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
         
          this.loadProducts();
          alert('Producto eliminado correctamente.');
        },
        error: (error) => {
          console.error('Error al eliminar el producto:', error);
          alert('No se pudo eliminar el producto.');
        },
      });
  }

 
  editProduct(product: Product) {
    this.router.navigate(['/product-form', product.id]); 
  }

  saveProduct(){
    this.router.navigate(['/product-add']);
  }

}
