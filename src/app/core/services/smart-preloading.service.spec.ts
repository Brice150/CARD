import { TestBed } from '@angular/core/testing';
import { Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Mock } from 'vitest';
import { ConnectionService } from './connection.service';
import { SmartPreloading } from './smart-preloading.service';

describe('SmartPreloading', () => {
  let strategy: SmartPreloading;
  let shouldPreload: Mock<() => boolean>;
  let load: Mock<() => Observable<unknown>>;

  /** Subscribes to the strategy and records what it emitted. */
  function preload(route: Route): unknown[] {
    const emitted: unknown[] = [];
    strategy.preload(route, load).subscribe((value) => emitted.push(value));
    return emitted;
  }

  beforeEach(() => {
    // The application is zoneless, so `fakeAsync` is out: the delay of the strategy is an rxjs
    // timer, which reads the clock of the page. Mocking that clock drives it just as precisely.
    vi.useFakeTimers();
    shouldPreload = vi.fn(() => true);
    load = vi.fn(() => of('chunk') as Observable<unknown>);
    TestBed.configureTestingModule({
      providers: [{ provide: ConnectionService, useValue: { shouldPreload } }],
    });
    strategy = TestBed.inject(SmartPreloading);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('leaves alone a route that did not ask to be preloaded', () => {
    const emitted = preload({ path: 'contact' });

    vi.advanceTimersByTime(5000);

    expect(load).not.toHaveBeenCalled();
    expect(emitted).toEqual([]);
  });

  it('waits before pulling a chunk, so that the first screen is served first', () => {
    const emitted = preload({ path: 'home', data: { preload: true } });

    vi.advanceTimersByTime(1499);
    expect(load).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(load).toHaveBeenCalled();
    expect(emitted).toEqual(['chunk']);
  });

  it('gives up when the connection is not good enough once the delay is over', () => {
    shouldPreload.mockReturnValue(false);

    const emitted = preload({ path: 'home', data: { preload: true } });
    vi.advanceTimersByTime(2000);

    expect(load).not.toHaveBeenCalled();
    expect(emitted).toEqual([]);
  });

  it('reads the connection at the end of the delay, not when the route is met', () => {
    shouldPreload.mockReturnValue(false);
    const emitted = preload({ path: 'home', data: { preload: true } });

    // The visitor reaches a better network while the delay runs.
    shouldPreload.mockReturnValue(true);
    vi.advanceTimersByTime(2000);

    expect(load).toHaveBeenCalled();
    expect(emitted).toEqual(['chunk']);
  });
});
