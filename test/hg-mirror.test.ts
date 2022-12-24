import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import { HgMirror } from '../src/components/hg-mirror';
import '../src/components/hg-mirror.js';

describe('HgMirror', () => {
  let element: HgMirror;
  beforeEach(async () => {
    element = await fixture(html`<hg-mirror></hg-mirror>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
