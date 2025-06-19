import { Component, DestroyRef } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent {
  product: Product = { id: 0, name: '', price: 0, image: '', quantity: 0 };
  constructor(
    private productService: ProductService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {}

  saveProduct(): void {
    const imageInput = document.getElementById('image') as HTMLInputElement;
    const file = imageInput?.files?.[0];

    if (!file) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('quantity', this.product.quantity.toString());
    formData.append('image', file);

    this.productService.createProduct(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/products']),
        error: (error) => console.error('Error al agregar el producto:', error),
      });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.product.image = file.name;
    }
  }
}
