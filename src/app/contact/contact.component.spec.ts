import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { Mock } from 'vitest';
import { environment } from '../../environments/environment';
import { Category } from '../core/enums/category';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let component: ContactComponent;
  let http: HttpTestingController;
  let toastr: { info: Mock; error: Mock };

  /** Fills the form with something the validators accept. */
  function fillIn(): void {
    component.contactForm.setValue({
      name: 'Brice',
      category: Category[Object.keys(Category)[0] as keyof typeof Category],
      email: 'brice@example.com',
      subject: 'Un devis',
      message: 'Bonjour, je souhaite un devis.',
    });
  }

  /**
   * Submits the form the way the visitor does, through the event the template is bound to. Going
   * through the DOM is what marks the view, exactly as it would in the browser.
   */
  function submit(): void {
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit'));
  }

  /**
   * Everything the template is currently showing.
   *
   * The refresh goes through `ApplicationRef.tick`, not `fixture.detectChanges`: the latter checks
   * the view whether or not it is marked, which would hide exactly what OnPush changes.
   */
  function rendered(): string {
    TestBed.inject(ApplicationRef).tick();
    return fixture.nativeElement.textContent as string;
  }

  beforeEach(async () => {
    toastr = { info: vi.fn(), error: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: toastr },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    // Attaches the fixture to the ApplicationRef, so that a refresh follows the marking of the
    // view the way it does in the browser instead of being forced.
    fixture.autoDetectChanges();
  });

  afterEach(() => http.verify());

  it('refuses to send an incomplete form and shows why', () => {
    submit();

    http.expectNone(environment.contactEndpoint);
    expect(component.contactForm.controls.name.touched).toBe(true);
    expect(rendered()).toContain('Le nom est obligatoire');
  });

  it('preselects the category carried by the route', () => {
    const known = Object.values(Category)[0];
    fixture.componentRef.setInput('category', known);
    fixture.detectChanges();

    expect(component.contactForm.controls.category.value).toBe(known);
  });

  it('ignores a category the site does not offer', () => {
    fixture.componentRef.setInput('category', 'inconnue');
    fixture.detectChanges();

    expect(component.contactForm.controls.category.value).toBe('');
  });

  it('clears the form and says so once the message is sent', () => {
    fillIn();
    submit();

    http.expectOne(environment.contactEndpoint).flush({});

    expect(component.contactForm.controls.name.value).toBe('');
    expect(toastr.info).toHaveBeenCalled();
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('#name') ??
      fixture.nativeElement.querySelector('input');
    fixture.detectChanges();
    expect(input.value).toBe('');
  });

  it('drops the error messages once the message has gone through', () => {
    // A first rejected attempt puts the errors on screen.
    submit();
    expect(rendered()).toContain('Le nom est obligatoire');

    fillIn();
    submit();
    http.expectOne(environment.contactEndpoint).flush({});

    // The reset runs on an HTTP answer: the view has to follow it, not keep the previous attempt
    // on screen.
    expect(rendered()).not.toContain('Le nom est obligatoire');
  });

  it('keeps what was typed when the message could not be sent', () => {
    fillIn();
    submit();

    http
      .expectOne(environment.contactEndpoint)
      .error(new ProgressEvent('failed'));

    expect(component.contactForm.controls.name.value).toBe('Brice');
    expect(toastr.error).toHaveBeenCalled();
  });
});
