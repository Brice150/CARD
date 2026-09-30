import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { mount } from '../../core/testing/mount';
import { COPIED_FEEDBACK, CopyTextDirective } from './copy-text.directive';

@Component({
  imports: [CopyTextDirective],
  template: `
    <button
      type="button"
      [appCopyText]="value"
      [appCopyLabel]="label()"
      (copiedText)="copied.set($event)"
    >
      Copier
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  readonly value = '06 30 84 63 97';
  readonly label = signal('Numéro copié');
  readonly copied = signal<string | null>(null);
}

describe('CopyTextDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let toastr: ToastrService;
  let writeText: ReturnType<typeof vi.fn>;

  const button = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('button');

  async function click(): Promise<void> {
    button().click();
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    vi.useFakeTimers();
    writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    fixture = await mount(HostComponent);
    toastr = TestBed.inject(ToastrService);
    vi.spyOn(toastr, 'info').mockReturnValue(undefined as never);
    vi.spyOn(toastr, 'error').mockReturnValue(undefined as never);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('copie la valeur, le signale, puis revient à l’état normal', async () => {
    await click();

    expect(writeText).toHaveBeenCalledWith('06 30 84 63 97');
    expect(button().classList).toContain('is-copied');
    expect(fixture.componentInstance.copied()).toBe('06 30 84 63 97');
    expect(toastr.info).toHaveBeenCalledWith(
      'Numéro copié',
      'Copie',
      expect.anything(),
    );

    await vi.advanceTimersByTimeAsync(COPIED_FEEDBACK);
    fixture.detectChanges();
    expect(button().classList).not.toContain('is-copied');
  });

  it('ne notifie pas sans libellé', async () => {
    fixture.componentInstance.label.set('');
    fixture.detectChanges();

    await click();

    expect(button().classList).toContain('is-copied');
    expect(toastr.info).not.toHaveBeenCalled();
  });

  it('se rabat sur la méthode historique quand le presse-papiers refuse', async () => {
    writeText.mockRejectedValue(new Error('refus'));
    const execCommand = vi.fn(() => true);
    document.execCommand = execCommand;

    await click();

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(button().classList).toContain('is-copied');
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('se rabat aussi sans presse-papiers', async () => {
    vi.stubGlobal('navigator', { ...navigator, clipboard: undefined });
    document.execCommand = vi.fn(() => true);

    await click();

    expect(button().classList).toContain('is-copied');
  });

  it('signale une copie impossible', async () => {
    writeText.mockRejectedValue(new Error('refus'));
    document.execCommand = vi.fn(() => false);

    await click();

    expect(button().classList).not.toContain('is-copied');
    expect(toastr.error).toHaveBeenCalled();
  });
});
