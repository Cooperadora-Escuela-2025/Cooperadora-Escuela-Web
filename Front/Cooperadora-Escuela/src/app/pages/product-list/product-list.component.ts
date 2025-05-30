import { Component, OnInit, DestroyRef } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';



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
    private cartService: CartService, // Inyectar CartService
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadProducts(); // Cargar los productos al inicializar el componente
    this.authService.currentUser$.subscribe(user => {
      this.isAdminUser = user?.is_staff || false;
    });
  }

  // Método para cargar los productos desde el backend
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

  // Método para agregar un producto al carrito
  addToCart(product: Product): void {
    this.cartService.addToCart(product); // Usar el servicio para agregar al carrito
    alert(`${product.name} ha sido agregado al carrito.`);
  }

  // Método para eliminar un producto
  deleteProduct(id: number) {
    this.productService.deleteProduct(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Si la eliminación es exitosa, recargar la lista de productos
          this.loadProducts();
          alert('Producto eliminado correctamente.');
        },
        error: (error) => {
          console.error('Error al eliminar el producto:', error);
          alert('No se pudo eliminar el producto.');
        },
      });
  }

  // Método para editar un producto
  editProduct(product: Product) {
    this.router.navigate(['/product-form', product.id]); // Navegar a la página de edición
  }

  saveProduct(){
    this.router.navigate(['/product-add']);
  }

}
