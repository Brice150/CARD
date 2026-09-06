import { provideZonelessChangeDetection, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

/**
 * Monte un composant autonome avec le strict nécessaire : détection zoneless et routeur, que
 * plusieurs composants réclament via `routerLink`.
 *
 * Les entrées sont posées avant le premier rendu, pour que le composant ne soit jamais vu dans un
 * état que l'application ne produit pas.
 */
export async function mount<T>(
  component: Type<T>,
  inputs: Record<string, unknown> = {},
): Promise<ComponentFixture<T>> {
  await TestBed.configureTestingModule({
    imports: [component],
    providers: [provideZonelessChangeDetection(), provideRouter([])],
  }).compileComponents();

  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

/** Texte rendu par le composant, espaces normalisés pour rester lisible dans les assertions. */
export function text(fixture: ComponentFixture<unknown>): string {
  return (fixture.nativeElement.textContent as string)
    .replace(/\s+/g, ' ')
    .trim();
}
