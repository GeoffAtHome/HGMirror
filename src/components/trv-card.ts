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
  TRVDevice,
  ZoneData,
  ZoneMode,
} from '../actions/hg-data';
import { SharedStyles } from './shared-styles';

import './zone-header';
import './battery-level';
import './temperature-level';
import './last-seen';
import { radiatorIcon } from './my-icons';

@customElement('trv-card')
export class TRVCard extends LitElement {
  @property({ type: Object })
  private trv: TRVDevice | undefined;

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
      ${radiatorIcon}
      <battery-level .data="${this.trv?.batteryLevel}"></battery-level>
      <temperature-level
        .temperature="${this.trv?.temperature}"
      ></temperature-level
      >&nbsp;
      <last-seen .lastSeen="${this.trv?.lastSeen}"></last-seen>
    `;
  }
}
