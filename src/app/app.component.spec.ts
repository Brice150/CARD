import { mount } from './core/testing/mount';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('assemble l’entête et la zone de routage', async () => {
    const fixture = await mount(AppComponent);

    expect(fixture.nativeElement.querySelector('app-header')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
