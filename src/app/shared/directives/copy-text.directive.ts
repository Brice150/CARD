import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  Directive,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/** Durée pendant laquelle l'élément copié garde son état « copié ». */
export const COPIED_FEEDBACK = 1800;

const TOAST_OPTIONS = {
  positionClass: 'toast-bottom-center',
  toastClass: 'ngx-toastr custom info',
};

/**
 * Copie une coordonnée (numéro, adresse e-mail) au clic, plutôt que d'ouvrir le téléphone ou la
 * messagerie. L'élément porte `.is-copied` le temps de la confirmation ; avec un libellé, une
 * notification la confirme aussi.
 */
@Directive({
  selector: '[appCopyText]',
  exportAs: 'appCopyText',
  host: {
    '(click)': 'copy()',
    '[class.is-copied]': 'copied()',
  },
})
export class CopyTextDirective {
  readonly appCopyText = input.required<string>();
  /** Message de la notification ; sans libellé, pas de notification. */
  readonly appCopyLabel = input('');
  /** Émis avec la valeur, une fois copiée. */
  readonly copiedText = output<string>();

  readonly copied = signal(false);

  private readonly document = inject(DOCUMENT);
  private readonly toastr = inject(ToastrService);
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  async copy(): Promise<void> {
    const value = this.appCopyText();

    try {
      await this.write(value);
    } catch {
      this.toastr.error('La copie a échoué', 'Copie', TOAST_OPTIONS);
      return;
    }

    this.copied.set(true);
    this.copiedText.emit(value);
    if (this.appCopyLabel()) {
      this.toastr.info(this.appCopyLabel(), 'Copie', TOAST_OPTIONS);
    }

    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), COPIED_FEEDBACK);
  }

  private async write(value: string): Promise<void> {
    const clipboard = globalThis.navigator.clipboard;

    // `navigator.clipboard` rejette hors contexte sécurisé : on tente, puis on retombe sur la
    // méthode historique.
    if (clipboard) {
      try {
        await clipboard.writeText(value);
        return;
      } catch {
        // Repli ci-dessous.
      }
    }

    const field = this.document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    this.document.body.appendChild(field);
    field.select();

    const ok = this.document.execCommand('copy');
    field.remove();

    if (!ok) {
      throw new Error('Copie refusée par le navigateur');
    }
  }
}
