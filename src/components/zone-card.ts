/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement, query } from 'lit/decorators.js';
import { defaultZoneData, ZoneData, ZoneMode } from '../actions/hg-data';
import { SharedStyles } from './shared-styles';

import './zone-header';

@customElement('zone-card')
export class ZoneCard extends LitElement {
  @property({ type: Object })
  private zone: ZoneData = defaultZoneData;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-grid;
        }

        .card {
          width: 400px;
          height: 250px;
          padding: 10px;
          margin: 10px;

          background-color: lightblue;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <a href="/timer/${this.zone.id}">
        <div class="card">
          <zone-header .zone="${this.zone}"></zone-header>
        </div>
      </a>
    `;
  }
}
