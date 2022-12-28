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
import {
  defaultZoneData,
  SwitchDevice,
  ZoneData,
  ZoneMode,
} from '../actions/hg-data';
import { SharedStyles } from './shared-styles';

import './zone-header';
import './battery-level';
import './last-seen';
import { powerIcon, radiatorIcon } from './my-icons';

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
          display: inline-flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          margin: 0px;
          height: var(--card-row-height);
          color: white;
          padding-left: 15px;
        }
      `,
    ];
  }

  protected render() {
    return html`
      ${powerIcon} ${this.switch?.onOff ? html`ON` : html`OFF`}
      <last-seen .lastSeen="${this.switch?.lastSeen}"></last-seen>
    `;
  }
}
