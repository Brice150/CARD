import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { Category } from '../core/enums/category';
import { Enterprise } from '../core/interfaces/enterprise';
import { enterprise } from '../shared/data/enterprise';
import { CopyTextDirective } from '../shared/directives/copy-text.directive';
import { RevealDirective } from '../shared/directives/reveal.directive';

/** How long the button keeps its "sent" check before offering to send again. */
export const SENT_FEEDBACK_MS = 2500;

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RevealDirective,
    CopyTextDirective,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  /** Bound from the `contact/:category` route param. */
  readonly category = input<string>();

  readonly categories: Category[] = Object.values(Category);

  /** A request is on its way: the button waits, and a second click sends nothing. */
  readonly sending = signal(false);
  /** The message went through: the button shows a check for a moment. */
  readonly sent = signal(false);
  /** The form was refused as incomplete: it shakes once. */
  readonly shaking = signal(false);
  private sentTimer?: ReturnType<typeof setTimeout>;

  readonly enterprise: Enterprise = enterprise;
  readonly phones: string[] = enterprise.phoneNumbers
    .split('|')
    .map((phone) => phone.trim());

  /** Ignores any category in the URL that is not one we actually offer. */
  private readonly selectedCategory = computed(() => {
    const category = this.category();
    return this.categories.find((known) => known === category) ?? '';
  });

  readonly contactForm = this.fb.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
    category: ['' as Category | '', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
    message: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(500)],
    ],
  });

  constructor() {
    effect(() => {
      this.contactForm.controls.category.setValue(this.selectedCategory());
    });
    this.destroyRef.onDestroy(() => clearTimeout(this.sentTimer));
  }

  submitForm(): void {
    if (this.sending()) {
      return;
    }

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.shaking.set(true);
      return;
    }

    this.sending.set(true);

    const { name, category, email, subject, message } =
      this.contactForm.getRawValue();

    this.http
      .post(environment.contactEndpoint, {
        name: `${name} (${category.charAt(0).toUpperCase()}${category.slice(1)})`,
        replyto: email,
        subject,
        message,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sending.set(false);
          this.sent.set(true);
          clearTimeout(this.sentTimer);
          this.sentTimer = setTimeout(
            () => this.sent.set(false),
            SENT_FEEDBACK_MS,
          );
          this.clearForm();
          this.toastr.info('Message envoyé', 'Message', {
            positionClass: 'toast-bottom-center',
            toastClass: 'ngx-toastr custom info',
          });
        },
        // The message is intentionally kept so the user can retry.
        error: () => {
          this.sending.set(false);
          this.toastr.error('Message non envoyé', 'Message', {
            positionClass: 'toast-bottom-center',
            toastClass: 'ngx-toastr custom',
          });
        },
      });
  }

  clearForm(): void {
    this.contactForm.reset({ category: this.selectedCategory() });
  }
}
