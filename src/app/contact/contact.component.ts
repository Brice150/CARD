import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../core/enums/category';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
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
export class ContactComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  contactForm!: FormGroup;
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  category!: string | null;
  categories: string[] = Object.values(Category);

  ngOnInit(): void {
    this.category = this.activatedRoute.snapshot.paramMap.get('category');

    this.contactForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      category: [this.category, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  submitForm(): void {
    if (this.contactForm.valid) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http
        .post(
          'https://formspree.io/f/xwpoqver',
          {
            name:
              this.contactForm.value.name +
              ' (' +
              this.contactForm.value.category.charAt(0).toUpperCase() +
              this.contactForm.value.category.slice(1) +
              ')',
            replyto: this.contactForm.value.email,
            subject: this.contactForm.value.subject,
            message: this.contactForm.value.message,
          },
          { headers: headers }
        )
        .subscribe({
          next: () => {
            this.clearForm();
            this.toastr.info('Message envoyé', 'Message', {
              positionClass: 'toast-bottom-center',
              toastClass: 'ngx-toastr custom info',
            });
          },
          error: () => {
            this.clearForm();
            this.toastr.error('Message non envoyé', 'Message', {
              positionClass: 'toast-bottom-center',
              toastClass: 'ngx-toastr custom',
            });
          },
        });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  clearForm(): void {
    this.contactForm.reset({
      name: '',
      category: this.category,
      email: '',
      subject: '',
      message: '',
    });
    this.contactForm.markAsPristine();
    this.contactForm.markAsUntouched();
  }
}
