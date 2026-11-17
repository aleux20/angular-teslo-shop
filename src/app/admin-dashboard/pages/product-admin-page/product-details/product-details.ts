import { Product } from '@/products/interfaces/product.interface';
import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { ProductCarousel } from '@/products/components/product-carousel/product-carousel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { FormErrorLabel } from '@/shared/components/form-error-label/form-error-label';
import { ProductsService } from '@/products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit, OnDestroy {
  product = input.required<Product>();
  productsService = inject(ProductsService);
  wasSaved = signal(false);
  isSaving = signal(false); 
  router = inject(Router);

  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);
  carouselImages = computed(() => [...this.tempImages(), ...this.product().images]);

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: ['', [Validators.required, Validators.min(0)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  ngOnDestroy(): void {
    this.revokeTempImages();
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeClicked(size: string) {
    const currentSizes = [...(this.productForm.value.sizes ?? [])];

    if (currentSizes.includes(size)) {
      const index = currentSizes.indexOf(size);
      currentSizes.splice(index, 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid || this.isSaving()) return;

    try {
      this.isSaving.set(true);
      const formValue = this.productForm.value;

      const productLike: Partial<Product> = {
        ...(formValue as any),
        tags:
          formValue.tags
            ?.toLowerCase()
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0) ?? [],
      };

      if (this.product().id === 'new') {
        const product = await firstValueFrom(
          this.productsService.createProduct(productLike, this.imageFileList),
        );
        this.router.navigate(['/admin/products', product.id]);
      } else {
        await firstValueFrom(
          this.productsService.updateProduct(this.product().id, productLike, this.imageFileList),
        );
      }

      this.wasSaved.set(true);
      setTimeout(() => {
        this.wasSaved.set(false);
      }, 3000);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  // Images handling
  onFilesChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    const fileList = input.files;

    if (!fileList || fileList.length === 0) return;

    this.imageFileList = fileList;
    this.revokeTempImages();

    const imageUrls = Array.from(fileList).map((file) => URL.createObjectURL(file));
    this.tempImages.set(imageUrls);
  }

  // <--- Nuevo método para eliminar una imagen temporal individual
  removeTempImage(index: number) {
    const currentImages = this.tempImages();
    const imageUrlToRemove = currentImages[index];

    // Revocar la URL específica para liberar memoria
    if (imageUrlToRemove) {
      URL.revokeObjectURL(imageUrlToRemove);
    }

    // Actualizar la señal de imágenes temporales
    const updatedImages = currentImages.filter((_, i) => i !== index);
    this.tempImages.set(updatedImages);

    // Si también manejas un FileList, podrías reconstruirlo aquí de ser necesario,
    // o dejar que el usuario re-seleccione si cambió de opinión.
    if (updatedImages.length === 0 && this.imageFileList) {
      this.imageFileList = undefined;
    }
  }

  private revokeTempImages() {
    this.tempImages().forEach((imageUrl) => URL.revokeObjectURL(imageUrl));
  }
}
