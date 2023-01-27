/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, PropertyValues } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement } from 'lit/decorators.js';
import { SharedStyles } from './shared-styles';

@customElement('last-seen')
export class LastSeen extends LitElement {
  @property({ type: Boolean })
  private down = false;

  @property({ type: Number })
  private lastSeen = 0;

  @property({ type: Number })
  private timer = NaN;

  private baseTime: number = 0;

  private intervalID: ReturnType<typeof setInterval> | undefined;

  private value = '0';

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-flex;
          flex-direction: row;
          padding-left: 15px;
          color: black;
        }
      `,
    ];
  }

  protected render() {
    return html`${this.value}`;
  }

  protected firstUpdated(): void {
    this.intervalID = setInterval(() => {
      this.timer += 1;
      this.requestUpdate();
    }, 1000);
    if (this.down) {
      this.baseTime = new Date().getTime() + this.lastSeen * 1000;
    } else {
      this.baseTime = this.lastSeen * 1000;
    }
  }

  updated(changedProps: PropertyValues): void {
    const now = new Date().getTime();
    const delta = this.down
      ? new Date(this.baseTime - now)
      : new Date(now - this.baseTime);
    const hours = delta.getUTCHours();
    const minutes = delta.getUTCMinutes();
    const seconds = delta.getUTCSeconds();
    if (hours === 0 && minutes === 0 && seconds === 0) this.value = '';
    else {
      const lhz = hours > 0 ? `${hours}:` : '';
      const lmz = minutes < 10 ? '0' : '';
      const lsz = seconds < 10 ? '0' : '';

      this.value = `${lhz}${lmz + minutes}:${lsz}${seconds}`;
    }
  }
}
