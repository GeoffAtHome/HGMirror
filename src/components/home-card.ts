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
// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';
import { defaultZoneData, DeviceType, ZoneData } from '../actions/hg-data';
import { SharedStyles } from './shared-styles';

import './zone-header';
import './trv-card';
import './sensor-card';
import './switch-card';
import { getTimeString } from './utils';

@customElement('home-card')
export class HomeCard extends LitElement {
  @query('zone-header')
  private header: HTMLElement | undefined;

  @property({ type: Object })
  private zone: ZoneData = defaultZoneData;

  @property({ type: String })
  private serverName: string = '';

  @property({ type: String })
  private authString: string = '';

  @property({ type: Number })
  private index = 0;

  @property({ type: Boolean })
  private on = true;

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

        .container {
          --card-primary-color: var(--mdc-theme-primary);
          --card-primary-color-on: orange;

          width: 310px;
          height: 150px;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .header {
          display: inline-block;
          height: var(--card-row-height);
          text-align: center;
          width: 100%;
          margin: 0px;
          color: white;
          background-color: var(--card-primary-color);
          font-size: 20px;
          border-radius: 5px 5px 0 0;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .on {
          background-color: var(--card-primary-color-on);
          text-align: center;
        }

        .home {
          display: inline-flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 0px;
          font-size: 12px;
        }

        .info {
          padding-left: 5px;
          width: 200px;
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
      <div class="container">
        <div
          class="header ${classMap({
            on: this.zone.isOn,
          })}"
        >
          ${this.zone.name}
        </div>
        <div class="home">
          <div class="info"></div>
          <div class="info">
            Daily: ${getTimeString(this.zone.tmBoilerDaily)}
          </div>
          <div class="info">
            Weekly: ${getTimeString(this.zone.tmBoilerWeekly)}
          </div>
          <div class="info">
            Temperature: ${this.zone.weatherData?.temperature}°C
          </div>
          <div class="info">
            Feels like: ${this.zone.weatherData?.feels_like}°C
          </div>
          <div class="info">
            Precipitation: ${this.zone.weatherData?.precipitation}%
          </div>
          <div class="info">Humidity: ${this.zone.weatherData?.humidity}%</div>
        </div>
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
