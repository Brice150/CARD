import { ComponentFixture } from '@angular/core/testing';
import { enterprise } from '../../shared/data/enterprise';
import { COPIED_FEEDBACK } from '../../shared/directives/copy-text.directive';
import { mount, text } from '../../core/testing/mount';
import {
  CardComponent,
  DEMO_DELAY,
  DEMO_HOLD,
  MAX_TILT,
} from './card.component';

describe('CardComponent', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const section = (fixture: ComponentFixture<CardComponent>): HTMLElement =>
    fixture.nativeElement.querySelector('section');

  const flipButton = (
    fixture: ComponentFixture<CardComponent>,
  ): HTMLButtonElement => fixture.nativeElement.querySelector('.flip-button');

  it('porte le nom de la société au recto', async () => {
    const fixture = await mount(CardComponent);

    expect(text(fixture)).toContain(enterprise.titleFront);
  });

  it('porte les coordonnées au verso', async () => {
    const fixture = await mount(CardComponent);
    const rendered = text(fixture);

    expect(rendered).toContain(enterprise.titleBack);
    expect(rendered).toContain(enterprise.subtitleBack);
    expect(rendered).toContain(enterprise.phoneNumbers);
    expect(rendered).toContain(enterprise.email);
  });

  it('a bien deux faces, la carte se retournant', async () => {
    const fixture = await mount(CardComponent);

    expect(fixture.nativeElement.querySelector('.front')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.back')).toBeTruthy();
  });

  describe('retournement', () => {
    it('se retourne au clic sur la carte, puis revient', async () => {
      const fixture = await mount(CardComponent);

      section(fixture).click();
      await fixture.whenStable();
      expect(section(fixture).classList).toContain('is-flipped');
      expect(
        fixture.nativeElement
          .querySelector('.back')
          .getAttribute('aria-hidden'),
      ).toBe('false');

      section(fixture).click();
      await fixture.whenStable();
      expect(section(fixture).classList).not.toContain('is-flipped');
    });

    it('se retourne au clavier par son bouton, qui annonce son état', async () => {
      const fixture = await mount(CardComponent);

      flipButton(fixture).click();
      await fixture.whenStable();

      expect(flipButton(fixture).getAttribute('aria-pressed')).toBe('true');
      expect(flipButton(fixture).textContent).toContain('Voir le recto');
      expect(
        fixture.nativeElement.querySelector('.tooltip').textContent,
      ).toContain('Cliquez pour revenir au recto');
      // Les coordonnées du verso ne deviennent atteignables au clavier qu'une fois visibles.
      expect(
        fixture.nativeElement.querySelector('.copy').hasAttribute('tabindex'),
      ).toBe(false);
    });
  });

  describe('copie des coordonnées', () => {
    let writeText: ReturnType<typeof vi.fn>;

    const copyButtons = (
      fixture: ComponentFixture<CardComponent>,
    ): HTMLButtonElement[] => [
      ...fixture.nativeElement.querySelectorAll('.copy'),
    ];

    const tooltip = (fixture: ComponentFixture<CardComponent>): string =>
      fixture.nativeElement.querySelector('.tooltip').textContent.trim();

    beforeEach(() => {
      vi.useFakeTimers();
      writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    });

    it('propose chaque numéro et l’adresse e-mail à la copie', async () => {
      const fixture = await mount(CardComponent);

      expect(
        copyButtons(fixture).map((button) => button.textContent?.trim()),
      ).toEqual([...fixture.componentInstance.phones, enterprise.email]);
    });

    it('copie un numéro sans retourner la carte, et le confirme', async () => {
      const fixture = await mount(CardComponent);
      await vi.advanceTimersByTimeAsync(0);
      const [phone] = fixture.componentInstance.phones;

      copyButtons(fixture)[0].click();
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();

      expect(writeText).toHaveBeenCalledWith(phone);
      expect(fixture.componentInstance.flipped()).toBe(false);
      expect(tooltip(fixture)).toBe('Copié !');
      expect(
        fixture.nativeElement.querySelector('.back .bx-check'),
      ).toBeTruthy();

      await vi.advanceTimersByTimeAsync(COPIED_FEEDBACK);
      fixture.detectChanges();
      expect(fixture.componentInstance.copied()).toBeNull();
    });

    it('copie l’adresse e-mail', async () => {
      const fixture = await mount(CardComponent);

      copyButtons(fixture).at(-1)!.click();
      await vi.advanceTimersByTimeAsync(0);

      expect(writeText).toHaveBeenCalledWith(enterprise.email);
      expect(fixture.componentInstance.copied()).toBe(enterprise.email);
    });

    it('dit dans l’infobulle ce que copiera le clic', async () => {
      const fixture = await mount(CardComponent);
      const [phone, , email] = copyButtons(fixture);

      phone.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(tooltip(fixture)).toBe('Cliquez pour copier ce numéro');

      email.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      expect(tooltip(fixture)).toBe('Cliquez pour copier l’adresse e-mail');

      email.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(tooltip(fixture)).toBe('Cliquez pour voir nos coordonnées');
    });
  });

  describe('démonstration', () => {
    it('montre son verso à l’arrivée, puis revient au recto', async () => {
      vi.useFakeTimers();
      const fixture = await mount(CardComponent);
      await vi.advanceTimersByTimeAsync(0);

      await vi.advanceTimersByTimeAsync(DEMO_DELAY);
      expect(fixture.componentInstance.flipped()).toBe(true);

      await vi.advanceTimersByTimeAsync(DEMO_HOLD);
      expect(fixture.componentInstance.flipped()).toBe(false);
    });

    it('s’interrompt dès que le visiteur retourne la carte', async () => {
      vi.useFakeTimers();
      const fixture = await mount(CardComponent);
      await vi.advanceTimersByTimeAsync(0);

      fixture.componentInstance.toggle();
      await vi.advanceTimersByTimeAsync(DEMO_DELAY + DEMO_HOLD);

      expect(fixture.componentInstance.flipped()).toBe(true);
    });

    it('n’a pas lieu quand les animations sont réduites', async () => {
      vi.useFakeTimers();
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      const fixture = await mount(CardComponent);
      await vi.advanceTimersByTimeAsync(DEMO_DELAY + DEMO_HOLD);

      expect(fixture.componentInstance.flipped()).toBe(false);
    });
  });

  describe('inclinaison', () => {
    function move(
      fixture: ComponentFixture<CardComponent>,
      pointerType: string,
      clientX: number,
      clientY: number,
    ): void {
      const stage: HTMLElement = fixture.nativeElement.querySelector('.stage');
      stage.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
      const event = new MouseEvent('pointermove', { clientX, clientY });
      Object.defineProperty(event, 'pointerType', { value: pointerType });
      stage.dispatchEvent(event);
    }

    it('suit la souris', async () => {
      const fixture = await mount(CardComponent);

      move(fixture, 'mouse', 200, 0);

      expect(fixture.componentInstance.tilt()).toEqual({
        x: MAX_TILT,
        y: MAX_TILT,
      });
    });

    it('ne s’incline pas sous le doigt', async () => {
      const fixture = await mount(CardComponent);

      move(fixture, 'touch', 200, 0);

      expect(fixture.componentInstance.tilt().x).toBe(0);
    });

    it('se redresse quand la souris s’en va', async () => {
      const fixture = await mount(CardComponent);
      move(fixture, 'mouse', 0, 100);

      fixture.nativeElement
        .querySelector('.stage')
        .dispatchEvent(new MouseEvent('pointerleave'));

      expect(fixture.componentInstance.tilt()).toEqual({ x: 0, y: 0 });
    });
  });
});
