import { mount } from '../core/testing/mount';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  it('assemble la carte de visite et les catégories de clients', async () => {
    const fixture = await mount(HomeComponent);

    expect(fixture.nativeElement.querySelector('app-card')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-clients')).toBeTruthy();
  });
});
