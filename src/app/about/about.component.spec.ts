import { goods } from '../shared/data/goods';
import { mount, text } from '../core/testing/mount';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  it('présente tous les biens du catalogue', async () => {
    const fixture = await mount(AboutComponent);

    expect(fixture.nativeElement.querySelectorAll('app-good').length).toBe(
      goods.length,
    );
    for (const good of goods) {
      expect(text(fixture)).toContain(good.name);
    }
  });
});
