import { mount } from '../core/testing/mount';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  it('ouvre les trois pages du site', async () => {
    const fixture = await mount(HeaderComponent);

    const links: string[] = Array.from(
      fixture.nativeElement.querySelectorAll('a[routerLink]'),
    ).map((link) => (link as HTMLAnchorElement).getAttribute('routerLink')!);

    expect(links).toEqual(['/home', '/about', '/contact']);
  });
});
