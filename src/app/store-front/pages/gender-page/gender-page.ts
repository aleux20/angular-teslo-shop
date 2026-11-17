import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductCard } from '@/products/components/product-card/product-card';
import { ProductsService } from '@/products/services/products.service';
import { Pagination } from '@/shared/components/pagination/pagination';
import { PaginationService } from '@/shared/components/pagination/pagination.service';

const GENDER_MAP: Record<string, string> = {
  men: 'Hombres',
  women: 'Mujeres',
  kid: 'Niños',
  kids: 'Niños',
};

const ITEMS_PER_PAGE = 12;

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  // Parámetro 'gender' de la ruta como Signal
  gender = toSignal(this.route.paramMap.pipe(map((params) => params.get('gender') ?? '')), {
    initialValue: this.route.snapshot.paramMap.get('gender') ?? '',
  });

  // Mapeo dinámico a título legible en español ('men' -> 'Hombres', 'women' -> 'Mujeres')
  genderLabel = computed(() => {
    const rawGender = this.gender().toLowerCase();
    return GENDER_MAP[rawGender] ?? this.gender();
  });

  // Reconsulta los productos cuando cambia el género de la ruta.
  productsResource = rxResource({
    params: () => ({
      gender: this.gender(),
      page: this.paginationService.currentPage(),
    }),
    stream: ({ params }) =>
      this.productsService.getProducts({
        gender: params.gender,
        limit: ITEMS_PER_PAGE,
        offset: (params.page - 1) * ITEMS_PER_PAGE,
      }),
  });
}
