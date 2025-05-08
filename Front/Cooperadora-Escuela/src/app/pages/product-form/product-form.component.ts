import { Component, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})

export class ProductFormComponent implements OnInit {
  product: Product = { id: 0, name: '', price: 0, image: '' };
  isEdit: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef // Inyectar DestroyRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id)
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
    if (this.isEdit) {
      const imageInput = document.getElementById('image') as HTMLInputElement;
      const image = imageInput?.files?.[0];
      if (image) {
        this.productService.updateProduct(this.product, image)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.router.navigate(['/products']);
            },
            error: (error) => {
              console.error('Error al actualizar el producto:', error);
            },
          });
      } else {
        alert('Por favor, selecciona una imagen.');
      }
    } else {
      const imageInput = document.getElementById('image') as HTMLInputElement;
      if (imageInput && imageInput.files && imageInput.files.length > 0) {
        const image = imageInput.files[0];
        this.productService.addProduct(this.product, image)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.router.navigate(['/products']);
            },
            error: (error) => {
              console.error('Error al agregar el producto:', error);
            },
          });
      } else {
        alert('Por favor, selecciona una imagen.');
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.product.image = file;
    }
  }
}