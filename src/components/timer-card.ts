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
import { property, customElement, state, query } from 'lit/decorators.js';

import '@material/mwc-fab';
import { SharedStyles } from './shared-styles';
import './time-zone';

import { ZoneData } from '../actions/hg-data';
import { clearIcon, restoreIcon, saveIcon } from './my-icons';

@customElement('timer-card')
export class TimerCard extends LitElement {
  @query('mwc-fab.clear')
  private fabClear!: any;

  @query('mwc-fab.save')
  private fabSave!: any;

  @query('mwc-fab.restore')
  private fabRestore!: any;

  @query('#fileRestore')
  private fileRestore!: HTMLElement;

  @query('#hiddenSaver')
  private hiddenSaver!: HTMLElement;

  @property({ type: Array })
  private zones!: Array<ZoneData>;

  @property({ type: Number })
  private zoneId = 0;

  @property({ type: String })
  private _filename = '';

  @property({ type: String })
  private _file = '';

  @property({ type: Boolean })
  private allZones: boolean = true;

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-block;
          padding: 10px;
          width: 95%;
        }

        mwc-fab.save {
          position: fixed;
          right: 200px;
          bottom: 30px;
        }

        mwc-fab.clear {
          position: fixed;
          right: 125px;
          bottom: 30px;
        }

        mwc-fab.restore {
          position: fixed;
          right: 50px;
          bottom: 30px;
        }
      `,
    ];
  }

  protected render() {
    return html`
      ${this.allZones
        ? html`${this.zones.map(
            item =>
              html`<h2>${item?.name}</h2>
                <time-zone .zone="${item}"></time-zone>`
          )}`
        : html`<h2>${this.zones[this.zoneId]?.name}</h2>
            <time-zone .zone="${this.zones[this.zoneId]}"></time-zone>`}

      <mwc-fab class="save" title="Save" @click="${this._save}"></mwc-fab>
      <mwc-fab class="clear" title="Clear" @click="${this._clear}"></mwc-fab>
      <mwc-fab
        class="restore"
        title="Restore"
        @click="${this._restore}"
      ></mwc-fab>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _clear() {
    const payload = {
      objTimer: [
        {
          fSP: 0,
          iDay: 0,
          iTm: 0,
        },
        {
          fSP: 0,
          iDay: 1,
          iTm: 0,
        },
        {
          fSP: 0,
          iDay: 2,
          iTm: 0,
        },
        {
          fSP: 0,
          iDay: 3,
          iTm: 0,
        },
        {
          fSP: 0,
          iDay: 4,
          iTm: 0,
        },
        {
          fSP: 0,
          iDay: 5,
          iTm: 0,
        },
        {
          fSP: 0,
          iDay: 6,
          iTm: 0,
        },
      ],
    };
    return payload;
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.fabSave.icon = saveIcon;
    this.fabClear.icon = clearIcon;
    this.fabRestore.icon = restoreIcon;
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(this.zoneId);
  }

  private _save() {
    const rawData = {
      /* addr: this.zone.id,
      data: {
        objTimer: this.zone.objTimer,
      },
      name: this.zone.name, */
    };

    const data = new Blob([JSON.stringify(rawData)], {
      type: 'application/json',
    });

    this._filename =
      this.zoneId === -1 ? 'all.json' : `${this.zones[this.zoneId].name}.json`;
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (this._file !== null) {
      window.URL.revokeObjectURL(this._file);
    }
    this._file = window.URL.createObjectURL(data);

    const event = new MouseEvent('click');
    this.hiddenSaver.dispatchEvent(event);
  }

  private _restore() {
    this.fileRestore.click();
  }

  // eslint-disable-next-line class-methods-use-this
  private _restoreFile() {
    /* const { length } = this.fileRestore.files;
    const file = this.fileRestore.files[0];

    const reader = new FileReader();
    reader.onloadstart = event => {
      this.dispatchEvent(
        new CustomEvent('load-start', {
          bubbles: true,
          composed: true,
          detail: event.target.result,
        })
      );
    };
    reader.onloadend = event => {
      this.dispatchEvent(
        new CustomEvent('update-timer', {
          bubbles: true,
          composed: true,
          detail: JSON.parse(event.target.result),
        })
      );
    };
    reader.onerror = event => {
      true,
        this.dispatchEvent(
          new CustomEvent('error', {
            bubbles: true,
            composed: true,
            detail: event.target.result,
          })
        );
      this.clearInput();
    };
    reader.abort = event => {
      this.dispatchEvent(
        new CustomEvent('abort', {
          bubbles: true,
          composed: true,
          detail: event.target.result,
        })
      );
      this.clearInput();
    };
    reader.onload = event => {
      // The file's text will be printed here
      this.dispatchEvent(
        new CustomEvent('load', {
          bubbles: true,
          composed: true,
          detail: event.target.result,
        })
      );

      this.clearInput();
    };
    reader.readAsText(file); */
  }

  private clearInput() {
    this.fileRestore.innerHTML = '';
  }
}
