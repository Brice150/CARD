import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
} from '@angular/core';

/**
 * Déclenche l'apparition des blocs `.reveal` (marqués `appReveal`) quand ils entrent à l'écran, et non plus au
 * chargement de la page : les sections du bas jouaient leur animation hors de vue.
 *
 * L'animation reste décrite dans `styles.css` ; la directive se contente de la lancer en posant
 * `.is-visible`. Sans `IntersectionObserver`, tout apparaît aussitôt.
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective {
  constructor() {
    const element = inject(ElementRef<HTMLElement>)
      .nativeElement as HTMLElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') {
        element.classList.add('is-visible');
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            element.classList.add('is-visible');
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
