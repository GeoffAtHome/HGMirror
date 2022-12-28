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
import { luminanceIcon } from './my-icons';
import { SharedStyles } from './shared-styles';

@customElement('luminance-level')
export class LuminanceLevel extends LitElement {
  @property({ type: Number })
  private luminance = 0;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-block;
          flex-flow: row;
          width: 55px;
          padding-left: 15px;
          color: black;
        }
      `,
    ];
  }

  protected render() {
    return html`${luminanceIcon}${this.luminance}`;
  }
}
