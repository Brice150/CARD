import { Category } from '../../../core/enums/category';
import { mount, text } from '../../../core/testing/mount';
import { ClientComponent } from './client.component';

describe('ClientComponent', () => {
  it('affiche la catégorie et chacun de ses profils', async () => {
    const fixture = await mount(ClientComponent, {
      client: {
        category: Category.PARTICULIER,
        types: ['Locataire', 'Acheteur'],
      },
    });

    const rendered = text(fixture);

    expect(rendered).toContain(Category.PARTICULIER);
    expect(rendered).toContain('Locataire');
    expect(rendered).toContain('Acheteur');
  });
});
