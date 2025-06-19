import { Component, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  // Agregamos quantity al producto
  product: Product = { id: 0, name: '', price: 0, image: '', quantity: 0 };
  isEdit: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (error) => {
          console.error('Error al cargar el producto:', error);
          this.router.navigate(['/products']);
        },
      });
  }

  saveProduct(): void {
    const imageInput = document.getElementById('image') as HTMLInputElement;
    const formData = new FormData();

    // Agregamos campos al formData
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('quantity', this.product.quantity.toString());

    const file = imageInput?.files?.[0];
    const isImageSelected = !!file;

    if (this.isEdit) {
      if (isImageSelected) {
        formData.append('image', file!);
      }

      this.productService.updateProduct(this.product.id, formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.router.navigate(['/products']),
          error: (error) => console.error('Error al actualizar el producto:', error),
        });

    } else {
      if (!isImageSelected) {
        alert('Por favor, selecciona una imagen.');
        return;
      }

      formData.append('image', file!);

      this.productService.createProduct(formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.router.navigate(['/products']),
          error: (error) => console.error('Error al agregar el producto:', error),
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.product.image = file.name;
    }
  }
}
