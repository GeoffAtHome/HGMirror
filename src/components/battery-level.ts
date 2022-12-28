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
import { SharedStyles } from './shared-styles';

import {
  battery20Icon,
  battery30Icon,
  battery50Icon,
  battery60Icon,
  battery80Icon,
  battery90Icon,
  batteryAlertIcon,
  batteryFullIcon,
} from './my-icons';

function getLevel(level: number) {
  if (level > 90) {
    return batteryFullIcon;
  }
  if (level > 80) {
    return battery90Icon;
  }
  if (level > 60) {
    return battery80Icon;
  }
  if (level > 50) {
    return battery60Icon;
  }
  if (level > 30) {
    return battery50Icon;
  }
  if (level > 20) {
    return battery30Icon;
  }
  if (level > 10) {
    return battery20Icon;
  }
  return batteryAlertIcon;
}

@customElement('battery-level')
export class BatteryLevel extends LitElement {
  @property({ type: Number })
  private batteryLevel = 100;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-flex;
          flex-direction: row;
          width: 63px;
          color: black;
        }
      `,
    ];
  }

  protected render() {
    return html`${getLevel(this.batteryLevel)}${this.batteryLevel}%`;
  }
}
