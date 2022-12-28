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
import { occupiedIcon, unoccupiedIcon } from './my-icons';
import { SharedStyles } from './shared-styles';

@customElement('motion-level')
export class MotionLevel extends LitElement {
  @property({ type: Number })
  private motion = 0;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-flex;
          flex-direction: row;
          padding-left: 15px;
        }
      `,
    ];
  }

  protected render() {
    return html`${this.motion > 0
      ? html`${occupiedIcon}`
      : html`${unoccupiedIcon}`} `;
  }
}
