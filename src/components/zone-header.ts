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
import { defaultZoneData, ZoneData, ZoneMode } from '../actions/hg-data';
import { boostIcon, footprintIcon, offIcon, timerIcon } from './my-icons';
import './last-seen';
import { SharedStyles } from './shared-styles';
import '@material/mwc-icon-button';
import { ZoneCard } from './zone-card';

@customElement('zone-header')
export class ZoneHeader extends LitElement {
  @property({ type: Object })
  private zone: ZoneData = defaultZoneData;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-flex;
          flex-direction: row;
          justify-content: space-between;
          height: var(--card-row-height);
          width: 100%;
          margin: 0px;
          color: white;
          background-color: var(--card-primary-color);
          font-size: 20px;
          border-radius: 5px 5px 0 0;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        :host([on]) {
          background-color: var(--card-primary-color-on);
          text-align: center;
        }

        .btnx {
          display: inline-flex;
          flex-direction: row;
          justify-content: space-between;
          height: var(--card-row-height);
        }

        mwc-icon-button {
          --mdc-icon-button-size: 24px;
          padding: 1px;
        }

        mwc-icon-button:hover {
          color: red;
        }

        mwc-icon-button.on {
          color: black;
        }

        mwc-icon-button.on:hover {
          color: black;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <div class="btnx">
        <mwc-icon-button
          class="btn  ${this.zone.mode === ZoneMode.ModeOff ? 'on' : 'off'}"
          title="off"
          slot="actionItems"
          >${offIcon}</mwc-icon-button
        >

        <mwc-icon-button
          class="${this.zone.mode === ZoneMode.ModeBoost ? 'on' : 'off'}"
          title="boost"
          slot="actionItems"
          >${boostIcon}</mwc-icon-button
        >

        <mwc-icon-button
          class="${this.zone.mode === ZoneMode.ModeTimer ? 'on' : 'off'}"
          title="on"
          slot="actionItems"
          >${timerIcon}</mwc-icon-button
        >

        ${this.zone.isSwitch === true
          ? html``
          : html`
              <mwc-icon-button
                class="${this.zone.mode === ZoneMode.ModeFootprint
                  ? 'on'
                  : 'off'}"
                title="footprint"
                slot="actionItems"
                >${footprintIcon}</mwc-icon-button
              >
            `}
      </div>
      <div>${this.zone.name}</div>
      ${this.zone.mode === ZoneMode.ModeBoost
        ? html` <div>
            <last-seen down .lastSeen="${this.zone.boost}"></last-seen>
          </div>`
        : html``}
    `;
  }
}
