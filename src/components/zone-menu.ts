import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('zone-menu')
export class ZoneMenu extends LitElement {
  @property({ type: String })
  private zoneName = '';

  @property({ type: String })
  public zoneID = '';

  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  render() {
    return html`<a name="${this.zoneName}" href="/timer/${this.zoneID}"
      >${this.zoneName}</a
    >`;
  }
}
