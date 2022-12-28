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
import { SensorDevice } from '../actions/hg-data';
import { SharedStyles } from './shared-styles';

import './battery-level';
import './last-seen';
import './temperature-level';
import './luminance-level';
import './motion-level';
import { sensorIcon } from './my-icons';

@customElement('sensor-card')
export class SensorCard extends LitElement {
  @property({ type: Object })
  private sensor: SensorDevice | undefined;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-flex;
          flex-direction: row;
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
      <div>
        ${sensorIcon}<battery-level
          .data="${this.sensor?.batteryLevel}"
        ></battery-level>
      </div>
      <temperature-level
        .temperature="${this.sensor?.temperature}"
      ></temperature-level>
      <last-seen .lastSeen="${this.sensor?.lastSeen}"></last-seen>
      <luminance-level .luminance="${this.sensor?.luminance}"></luminance-level>
      <motion-level .motion="${this.sensor?.motion}"></motion-level>
    `;
  }
}
