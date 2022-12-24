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
import { defaultZoneData, ZoneData, ZoneMode } from '../actions/hg-data';
import { boostIcon, footprintIcon, offIcon, timerIcon } from './my-icons';
import './last-seen';
import { SharedStyles } from './shared-styles';

@customElement('zone-header')
export class ZoneHeader extends LitElement {
  @property({ type: Object })
  private zone: ZoneData = defaultZoneData;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-block;
          width: 100%;
          margin: 0px;
          height: 28px;
          color: white;
          background-color: var(--app-primary-color);
          font-size: 20px;
          border-radius: 5px 5px 0 0;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        :host([on]) {
          background-color: orange;
        }

        paper-icon-button {
          margin: 0px;
          padding: 1px;
          width: 28px;
          height: 28px;
          bottom: 3px;
          color: white;
        }

        paper-icon-button:hover {
          background-color: var(--paper-green-500);
          color: white;
        }

        paper-icon-button.on {
          --paper-icon-button-ink-color: pink;
          color: black;
        }

        paper-icon-button.on:hover {
          background-color: var(--paper-pink-500);
          color: white;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <div class="layout horizontal justified top">
        <div class="layout horizontal layout-start">
          <a href="/home/[[zone.iID]]/off">${offIcon}</a>
          <a href="/boost/[[zone.iID]]">${boostIcon}</a>
          <a href="/home/[[zone.iID]]/timer">${timerIcon}</a>
          ${this.zone.isSwitch === true
            ? html``
            : html`<a href="/home/[[zone.iID]]/footprint">${footprintIcon}</a>`}
        </div>
        <span>${this.zone.name}</span>
        <div>
          <last-seen .lastSeen="${this.zone.boost}"></last-seen>
        </div>
      </div>
    `;
  }
}
