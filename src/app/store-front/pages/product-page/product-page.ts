import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@/products/services/products.service';
import { ProductCarousel } from '@/products/components/product-carousel/product-carousel';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-page',
  imports: [CurrencyPipe, ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  private routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  productResource = rxResource({
    params: () => this.routeParams().get('idSlug') ?? undefined,
    stream: ({ params }) => this.productsService.getProductByIdSlug(params),
  });
}
