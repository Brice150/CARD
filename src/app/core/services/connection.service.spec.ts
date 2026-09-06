import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConnectionService } from './connection.service';

interface FakeConnection extends EventTarget {
  effectiveType: string;
  downlink: number;
  saveData: boolean;
}

describe('ConnectionService', () => {
  let listeners: (() => void)[];

  /**
   * Puts a network of the given shape on the navigator. Returns it so that a test can change it
   * and announce the change the way the browser does.
   */
  function withNetwork(
    shape: Partial<
      Pick<FakeConnection, 'effectiveType' | 'downlink' | 'saveData'>
    >,
  ): FakeConnection {
    const connection = {
      effectiveType: '4g',
      downlink: 10,
      saveData: false,
      ...shape,
      addEventListener: (_: string, listener: () => void) =>
        listeners.push(listener),
      removeEventListener: () => undefined,
    } as unknown as FakeConnection;
    Object.defineProperty(navigator, 'connection', {
      value: connection,
      configurable: true,
    });
    return connection;
  }

  function service(platform = 'browser'): ConnectionService {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: platform }],
    });
    return TestBed.inject(ConnectionService);
  }

  /**
   * Hides the network from the service.
   *
   * jsdom carries no `navigator.connection`, but a previous test leaves its own behind: deleting
   * the override is not enough, the absence has to be stated so no test inherits another's network.
   */
  function withoutNetwork(): void {
    Object.defineProperty(navigator, 'connection', {
      value: undefined,
      configurable: true,
    });
  }

  beforeEach(() => {
    listeners = [];
    withoutNetwork();
  });

  afterEach(() => {
    withoutNetwork();
  });

  it('preloads on a wide connection', () => {
    withNetwork({ effectiveType: '4g', downlink: 10 });

    expect(service().shouldPreload()).toBe(true);
  });

  it('holds back when the visitor asked to save data', () => {
    withNetwork({ saveData: true });

    expect(service().shouldPreload()).toBe(false);
  });

  it('holds back on a slow network', () => {
    withNetwork({ effectiveType: '3g' });

    expect(service().shouldPreload()).toBe(false);
  });

  it('holds back when the bandwidth sits under the threshold', () => {
    withNetwork({ downlink: 1.4 });

    expect(service().shouldPreload()).toBe(false);
  });

  it('accepts the threshold itself', () => {
    withNetwork({ downlink: 1.5 });

    expect(service().shouldPreload()).toBe(true);
  });

  it('follows the network when it changes under the visitor', () => {
    const connection = withNetwork({ effectiveType: '4g', downlink: 10 });
    const connectionService = service();
    expect(connectionService.shouldPreload()).toBe(true);

    connection.effectiveType = '2g';
    listeners.forEach((listener) => listener());

    expect(connectionService.shouldPreload()).toBe(false);
  });

  it('preloads when the browser tells nothing about the network', () => {
    withoutNetwork();

    expect(service().shouldPreload()).toBe(true);
  });

  it('preloads on the server, where there is no navigator to ask', () => {
    withNetwork({ effectiveType: '2g', saveData: true });

    expect(service('server').shouldPreload()).toBe(true);
  });
});
