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
  @query('zone-header')
  private header: HTMLElement | undefined;

  @property({ type: Object })
  private zone: ZoneData = defaultZoneData;

  @property({ type: Number })
  private index = 0;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 10px;
        }

        div {
          --card-row-height: 28px;
          --card-primary-color: var(--mdc-theme-primary);
          --card-primary-color-on: orange;

          width: 310px;
          height: 150px;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        a {
          color: var(--card-primary-color);
          text-decoration: none;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <div>
        <a href="/#timers#${this.index}">
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
      </div>
    `;
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (this.zone.isOn) this.header?.setAttribute('on', '');
    else this.header?.removeAttribute('on');
  }
}
