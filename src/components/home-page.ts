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
import { ZoneData } from '../actions/hg-data';
import { SharedStyles } from './shared-styles';

import './zone-card';

@customElement('home-page')
export class HomePage extends LitElement {
  @property({ type: Array })
  private zones: Array<ZoneData> = [];

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
    return html`<div>
      ${this.zones.map(item => html`<zone-card .zone="${item}"></zone-card>`)}
    </div>`;
  }
}
