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
import { temperatureIcon } from './my-icons';
import { SharedStyles } from './shared-styles';

@customElement('temperature-level')
export class TemperatureLevel extends LitElement {
  @property({ type: Number })
  private temperature = 0;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-flex;
          flex-direction: row;
          width: 62px;
          color: black;
        }
      `,
    ];
  }

  protected render() {
    return html`${temperatureIcon}${this.temperature}°`;
  }
}
