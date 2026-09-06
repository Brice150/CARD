import { routes } from './app.routes';

describe('routes', () => {
  it('charge chaque page à la demande plutôt qu’au démarrage', () => {
    const pages = routes.filter((route) => route.path !== '**');

    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(page.loadComponent, `route ${page.path}`).toBeDefined();
    }
  });

  it('précharge les pages du menu, et elles seules', () => {
    const preloaded = routes
      .filter((route) => route.data?.['preload'] === true)
      .map((route) => route.path);

    expect(preloaded).toEqual([
      'home',
      'about',
      'contact',
      'contact/:category',
    ]);
  });

  it('renvoie une adresse inconnue vers l’accueil, en dernier recours', () => {
    const fallback = routes[routes.length - 1];

    expect(fallback.path).toBe('**');
    expect(fallback.redirectTo).toBe('home');
  });

  it('résout chaque page vers un composant qui existe vraiment', async () => {
    const pages = routes.filter((route) => route.loadComponent);

    for (const page of pages) {
      const loaded = await page.loadComponent!();

      expect(loaded, `route ${page.path}`).toEqual(expect.any(Function));
    }
  });
});
