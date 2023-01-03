/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, PropertyValueMap } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement, query, state } from 'lit/decorators.js';
import { defaultZoneData, ZoneData, ZoneMode } from '../actions/hg-data';
import { SharedStyles } from './shared-styles';
import '@material/mwc-button';
import './home-card';
import './zone-card';
import './boost-dialog';

@customElement('home-page')
export class HomePage extends LitElement {
  @query('boost-dialog')
  private boostDialog!: any;

  @property({ type: Array })
  private zones: Array<ZoneData> = [];

  @property({ type: String })
  private serverName: string = '';

  @property({ type: String })
  private authString: string = '';

  @state()
  zone: ZoneData = defaultZoneData;

  private openBoostDialog(event: CustomEvent<{ zone: ZoneData }>) {
    this.zone = event.detail.zone;
    this.boostDialog._open = true;
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: block;
        }

        div {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <div @boost-dialog=${this.openBoostDialog}>
        ${this.zones.map((item, index) =>
          item.id === 0
            ? html`<home-card
                .zone="${item}"
                .index="${index}"
                .authString="${this.authString}"
                .serverName="${this.serverName}"
              ></home-card>`
            : html`<zone-card
                .zone="${item}"
                .index="${index}"
                .authString="${this.authString}"
                .serverName="${this.serverName}"
              ></zone-card>`
        )}
      </div>
      <boost-dialog
        .zone=${this.zone}
        .authString="${this.authString}"
        .serverName="${this.serverName}"
      ></boost-dialog>
    `;
  }
}
