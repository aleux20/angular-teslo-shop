import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  viewChild,
} from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'app-product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styles: `
    .swiper {
      width: 100%;
      height: 480px;
      --swiper-navigation-color: oklch(var(--p));
      --swiper-pagination-color: oklch(var(--p));
      --swiper-pagination-bullet-inactive-color: oklch(var(--bc) / 0.3);
      --swiper-pagination-bullet-inactive-opacity: 1;
    }

    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .swiper-button-next,
    .swiper-button-prev {
      background-color: oklch(var(--b1) / 0.75);
      backdrop-filter: blur(4px);
      width: 42px;
      height: 42px;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition:
        transform 0.2s ease,
        background-color 0.2s ease;
    }

    .swiper-button-next:hover,
    .swiper-button-prev:hover {
      background-color: oklch(var(--b1));
      transform: scale(1.05);
    }

    .swiper-button-next::after,
    .swiper-button-prev::after {
      font-size: 16px;
      font-weight: bold;
    }
  `,
})
export class ProductCarousel implements AfterViewInit, OnDestroy {
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef<HTMLDivElement>>('swiperDiv');

  private swiperInstance?: Swiper;

  constructor() {
    // Efecto reactivo para recrear el Swiper si las imágenes cambian asíncronamente
    effect(() => {
      // Registramos la señal para que el efecto se ejecute al cambiar
      const currentImages = this.images();

      if (this.swiperInstance) {
        this.swiperInstance.destroy(true, true);
        // Pequeño respiro para que el DOM renderice los nuevos @for slides antes de reiniciar
        setTimeout(() => this.initSwiper(), 0);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper(): void {
    const element = this.swiperDiv()?.nativeElement;
    if (!element) return;

    this.swiperInstance = new Swiper(element, {
      direction: 'horizontal',
      loop: this.images().length > 1,
      modules: [Navigation, Pagination],
      observer: true,
      observeParents: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  ngOnDestroy(): void {
    this.swiperInstance?.destroy(true, true);
  }
}
