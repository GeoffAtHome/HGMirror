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
  DeviceType,
  ZoneData,
  ZoneMode,
} from '../actions/hg-data';
import { SharedStyles } from './shared-styles';

import './zone-header';
import './trv-card';
import './sensor-card';
import './switch-card';

@customElement('zone-card')
export class ZoneCard extends LitElement {
  @property({ type: Object })
  private zone: ZoneData = defaultZoneData;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          --card-row-height: 50px;

          display: inline-flex;
          flex-direction: row;
          justify-content: space-between;
          width: 400px;
          height: 250px;
          margin: 10px;
          color: white;
          font-size: 20px;
          border-radius: 5px 5px 0 0;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
      `,
    ];
  }

  protected render() {
    return html`
      <a href="/timer/${this.zone.id}">
        <zone-header .zone="${this.zone}"></zone-header>
        ${this.zone.devices.map(item => {
          switch (item.deviceType) {
            case DeviceType.trv:
              return html`<trv-card .trv="${item}"></trv-card>`;

            case DeviceType.sensor:
              return html`<sensor-card .sensor="${item}"></sensor-card>`;

            case DeviceType.switch:
              return html`<switch-card .switch="${item}"></switch-card>`;

            default:
              return html``;
          }
        })}
      </a>
    `;
  }
}
