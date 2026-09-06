import { clients } from '../../shared/data/clients';
import { mount } from '../../core/testing/mount';
import { ClientsComponent } from './clients.component';

describe('ClientsComponent', () => {
  it('présente une fiche par catégorie de client', async () => {
    const fixture = await mount(ClientsComponent);

    expect(fixture.nativeElement.querySelectorAll('app-client').length).toBe(
      clients.length,
    );
  });
});
