import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';

interface NetworkInformation extends EventTarget {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  saveData: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private static readonly MIN_DOWNLINK_MBPS = 1.5;

  private readonly canPreload = signal(true);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    if (!this.isBrowser) return;

    const connection = (navigator as NavigatorWithConnection).connection;

    if (!connection) return;

    const update = (): void => {
      this.canPreload.set(
        !connection.saveData &&
          connection.effectiveType === '4g' &&
          connection.downlink >= ConnectionService.MIN_DOWNLINK_MBPS,
      );
    };

    update();
    connection.addEventListener('change', update);
    this.destroyRef.onDestroy(() =>
      connection.removeEventListener('change', update),
    );
  }

  shouldPreload(): boolean {
    return this.canPreload();
  }
}
