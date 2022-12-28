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
import { property, customElement } from 'lit/decorators.js';
import { SwitchDevice } from '../actions/hg-data';
import { SharedStyles } from './shared-styles';

import './zone-header';
import './battery-level';
import './last-seen';

@customElement('switch-card')
export class SwitchCard extends LitElement {
  @property({ type: Object })
  private switch: SwitchDevice | undefined;

  @property({ type: Boolean })
  private on = false;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: grid;
          place-items: center;
          font-size: 50px;
          width: 100%;
          line-height: 122px;
          color: black;
        }
      `,
    ];
  }

  protected render() {
    return html`${this.switch?.onOff ? html`ON` : html`OFF`} `;
  }
}
