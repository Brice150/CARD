import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { mount } from '../../core/testing/mount';
import { RevealDirective } from './reveal.directive';

@Component({
  imports: [RevealDirective],
  template: '<p class="reveal" appReveal>Contenu</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

describe('RevealDirective', () => {
  let callback: IntersectionObserverCallback | undefined;
  const disconnect = vi.fn();

  const paragraph = (fixture: ComponentFixture<HostComponent>): HTMLElement =>
    fixture.nativeElement.querySelector('p');

  const intersect = (isIntersecting: boolean): void =>
    callback?.(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

  beforeEach(() => {
    callback = undefined;
    disconnect.mockReset();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(next: IntersectionObserverCallback) {
          callback = next;
        }
        observe = vi.fn();
        disconnect = disconnect;
      },
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('attend que le bloc entre à l’écran', async () => {
    const fixture = await mount(HostComponent);
    await fixture.whenStable();

    intersect(false);

    expect(paragraph(fixture).classList).not.toContain('is-visible');
  });

  it('lance l’apparition une fois le bloc visible, puis cesse d’observer', async () => {
    const fixture = await mount(HostComponent);
    await fixture.whenStable();

    intersect(true);

    expect(paragraph(fixture).classList).toContain('is-visible');
    expect(disconnect).toHaveBeenCalled();
  });

  it('cesse d’observer à la destruction', async () => {
    const fixture = await mount(HostComponent);
    await fixture.whenStable();

    fixture.destroy();

    expect(disconnect).toHaveBeenCalled();
  });

  it('montre tout aussitôt sans IntersectionObserver', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    const fixture = await mount(HostComponent);
    await fixture.whenStable();

    expect(paragraph(fixture).classList).toContain('is-visible');
  });
});
