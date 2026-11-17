import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private activateRoute = inject(ActivatedRoute);

  currentPage = toSignal(
    this.activateRoute.queryParamMap.pipe(
      map((params) => Number(params.get('page') ?? 1)),
      map((page) => (Number.isInteger(page) && page > 0 ? page : 1)),
    ),
    { initialValue: 1 },
  );
}
