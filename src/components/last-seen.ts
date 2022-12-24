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

@customElement('last-seen')
export class LastSeen extends LitElement {
  @property({ type: Number })
  private baseTime: number = 0;

  @property({ type: Boolean })
  private down = false;

  @property({ type: Number })
  private lastSeen = 0;

  @property({ type: Number })
  private timer = NaN;

  private intervalID: number | null = null;

  @property({ type: String })
  private value = '';

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-block;
          width: 50px;
        }
      `,
    ];
  }

  protected render() {
    return html` <span>${this.value}</span> `;
  }

  protected firstUpdated(): void {
    this.intervalID = window.setInterval(() => {
      this.timer += 1;
      this.requestUpdate();
    }, 1000);
    if (this.down) {
      this.baseTime = new Date().getTime() + this.lastSeen * 1000;
    } else {
      this.baseTime = this.lastSeen * 1000;
    }
  }

  update() {
    const now = new Date().getTime();
    const delta = this.down
      ? new Date(this.baseTime - now)
      : new Date(now - this.baseTime);
    const minutes = delta.getUTCMinutes();
    const seconds = delta.getUTCSeconds();
    const lmz = minutes < 10 ? '0' : '';
    const lsz = seconds < 10 ? '0' : '';
    this.value = `${lmz + minutes}:${lsz}${seconds}`;
  }
}
