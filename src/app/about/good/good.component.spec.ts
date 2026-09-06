import { environment } from '../../../environments/environment';
import { mount, text } from '../../core/testing/mount';
import { GoodComponent } from './good.component';

describe('GoodComponent', () => {
  it('affiche le bien qu’on lui donne', async () => {
    const fixture = await mount(GoodComponent, {
      good: { name: 'Parkings', image: 'Parking.webp' },
    });

    expect(text(fixture)).toContain('Parkings');
  });

  it('cherche l’image dans le dossier des biens', async () => {
    const fixture = await mount(GoodComponent, {
      good: { name: 'Maisons', image: 'Maison.webp' },
    });

    const image: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(image.getAttribute('src')).toBe(
      environment.imagePath + 'goods/Maison.webp',
    );
  });
});
