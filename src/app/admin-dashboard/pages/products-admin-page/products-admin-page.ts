import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductTable } from '@/products/components/product-table/product-table';
import { ProductsService } from '@/products/services/products.service';
import { Pagination } from '@/shared/components/pagination/pagination';
import { PaginationService } from '@/shared/components/pagination/pagination.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  private productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  paginationService = inject(PaginationService);
  productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage(),
      limit: this.productsPerPage(),
    }),
    stream: ({ params }) =>
      this.productsService.getProducts({
        limit: params.limit,
        offset: (params.page - 1) * params.limit,
      }),
  });

  onProductsPerPageChange(event: Event): void {
    const productsPerPage = Number((event.target as HTMLSelectElement).value);

    if (![10, 20, 50, 100].includes(productsPerPage)) {
      return;
    }

    this.productsPerPage.set(productsPerPage);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1 },
      queryParamsHandling: 'merge',
    });
  }
}
