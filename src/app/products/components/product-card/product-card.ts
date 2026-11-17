import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../interfaces/product.interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, ProductImagePipe, RouterLink],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();
}
