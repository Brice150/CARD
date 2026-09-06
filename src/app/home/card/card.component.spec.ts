import { enterprise } from '../../shared/data/enterprise';
import { mount, text } from '../../core/testing/mount';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  it('porte le nom de la société au recto', async () => {
    const fixture = await mount(CardComponent);

    expect(text(fixture)).toContain(enterprise.titleFront);
  });

  it('porte les coordonnées au verso', async () => {
    const fixture = await mount(CardComponent);
    const rendered = text(fixture);

    expect(rendered).toContain(enterprise.titleBack);
    expect(rendered).toContain(enterprise.subtitleBack);
    expect(rendered).toContain(enterprise.phoneNumbers);
    expect(rendered).toContain(enterprise.email);
  });

  it('a bien deux faces, la carte se retournant', async () => {
    const fixture = await mount(CardComponent);

    expect(fixture.nativeElement.querySelector('.front')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.back')).toBeTruthy();
  });
});
