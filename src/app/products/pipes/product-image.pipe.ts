import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

const placeholderImage = '/assets/images/no-image.jpg';

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[] | null | undefined): string {
    const image = Array.isArray(value) ? value[0] : value;
    const imageName = image?.trim();

    if (!imageName) {
      return placeholderImage;
    }

    if (/^https?:\/\//i.test(imageName)) {
      return imageName;
    }

    if (imageName.startsWith('blob:')) {
      return imageName;
    }

    return `${environment.baseUrl}/files/product/${encodeURIComponent(imageName)}`;
  }
}
