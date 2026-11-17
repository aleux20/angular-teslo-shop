import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class Pagination {
  pages = input.required<number>();
  currentPage = input<number>(1);

  // Calcula una lista inteligente con puntos suspensivos (...) para evitar desbordar la pantalla
  pagesList = computed<(number | string)[]>(() => {
    const total = this.pages();
    const current = this.currentPage();

    // Si hay 7 o menos páginas, muestra todas
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Cerca del inicio
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }

    // Cerca del final
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }

    // En el medio
    return [1, '...', current - 1, current, current + 1, '...', total];
  });
}
