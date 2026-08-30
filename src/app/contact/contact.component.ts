import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, computed, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { Category } from '../core/enums/category';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  /** Bound from the `contact/:category` route param. */
  readonly category = input<string>();

  readonly categories: Category[] = Object.values(Category);

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
  }

  submitForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

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
          this.clearForm();
          this.toastr.info('Message envoyé', 'Message', {
            positionClass: 'toast-bottom-center',
            toastClass: 'ngx-toastr custom info',
          });
        },
        // The message is intentionally kept so the user can retry.
        error: () => {
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
