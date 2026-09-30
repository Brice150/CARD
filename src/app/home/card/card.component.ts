import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { Enterprise } from '../../core/interfaces/enterprise';
import { enterprise } from '../../shared/data/enterprise';
import {
  COPIED_FEEDBACK,
  CopyTextDirective,
} from '../../shared/directives/copy-text.directive';

/** Inclinaison maximale de la carte sous le pointeur, en degrés. */
export const MAX_TILT = 8;
/** Démonstration à l'arrivée : la carte montre son verso, puis revient. */
export const DEMO_DELAY = 1400;
export const DEMO_HOLD = 2600;

type Contact = 'phone' | 'email';

@Component({
  selector: 'app-card',
  imports: [CopyTextDirective],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly imagePath = environment.imagePath;
  readonly enterprise: Enterprise = enterprise;
  /** Le titre du verso, découpé autour de son esperluette. */
  readonly titleBackParts = enterprise.titleBack
    .split('&')
    .map((part) => part.trim());

  /** Verso visible. La carte ne tourne plus seule : c'est le visiteur qui la retourne. */
  readonly flipped = signal(false);
  /** Inclinaison suivant le pointeur. */
  readonly tilt = signal({ x: 0, y: 0 });

  readonly phones: string[] = enterprise.phoneNumbers
    .split('|')
    .map((phone) => phone.trim());
  /** Dernière coordonnée copiée, le temps d'afficher sa coche. */
  readonly copied = signal<string | null>(null);
  /** Coordonnée survolée : l'infobulle dit ce que fera le clic. */
  readonly hovered = signal<Contact | null>(null);

  readonly hint = computed(() => {
    if (this.copied()) {
      return 'Copié !';
    }
    switch (this.hovered()) {
      case 'phone':
        return 'Cliquez pour copier ce numéro';
      case 'email':
        return 'Cliquez pour copier l’adresse e-mail';
      default:
        return this.flipped()
          ? 'Cliquez pour revenir au recto'
          : 'Cliquez pour voir nos coordonnées';
    }
  });

  private demo: ReturnType<typeof setTimeout>[] = [];
  private copiedTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Un seul aller-retour à l'arrivée, pour montrer que la carte a deux faces.
    afterNextRender(() => {
      if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      this.demo = [
        setTimeout(() => this.flipped.set(true), DEMO_DELAY),
        setTimeout(() => this.flipped.set(false), DEMO_DELAY + DEMO_HOLD),
      ];
    });
    destroyRef.onDestroy(() => {
      this.stopDemo();
      clearTimeout(this.copiedTimer);
    });
  }

  toggle(): void {
    this.stopDemo();
    this.flipped.update((flipped) => !flipped);
  }

  /** Un clic sur la carte la retourne, sauf sur une coordonnée à copier. */
  onCardClick(event: MouseEvent): void {
    if ((event.target as Element).closest('button')) {
      return;
    }
    this.toggle();
  }

  /** Une coordonnée vient d'être copiée : l'infobulle et l'icône le confirment. */
  onCopied(value: string): void {
    this.stopDemo();
    this.copied.set(value);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(null), COPIED_FEEDBACK);
  }

  /** Seule une souris incline la carte : au doigt, le geste sert à la retourner. */
  onPointerMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') {
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    this.tilt.set({
      x: Math.round((0.5 - y) * 2 * MAX_TILT * 10) / 10,
      y: Math.round((x - 0.5) * 2 * MAX_TILT * 10) / 10,
    });
  }

  resetTilt(): void {
    this.tilt.set({ x: 0, y: 0 });
  }

  private stopDemo(): void {
    this.demo.forEach(clearTimeout);
    this.demo = [];
  }
}
