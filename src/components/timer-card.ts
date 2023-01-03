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
// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';

import '@material/mwc-fab';
// eslint-disable-next-line import/no-duplicates
import { Dialog } from '@material/mwc-dialog';
import { SharedStyles } from './shared-styles';
// eslint-disable-next-line import/no-duplicates
import '@material/mwc-dialog';
import '@material/mwc-button';
import './time-zone';

import { HgMode, HgTimer, ZoneData } from '../actions/hg-data';
import { clearIcon, restoreIcon, saveIcon } from './my-icons';
import { updateHgMode } from '../reducers/hg-data';

interface TimerData {
  addr: number;
  objTimer: Array<HgTimer>;
  name: string;
}

const VERSION_SIGNATURE = 'HG-MIRROR V3';
interface SavedData {
  version: string;
  savedDate: Date;
  zones: Array<TimerData>;
}

@customElement('timer-card')
export class TimerCard extends LitElement {
  @query('#invalid')
  private invalidFileDialog!: Dialog;

  @query('#restore')
  private restoreFileDialog!: Dialog;

  @query('mwc-fab.clear')
  private fabClear!: any;

  @query('mwc-fab.save')
  private fabSave!: any;

  @query('mwc-fab.restore')
  private fabRestore!: any;

  @query('#fileRestore')
  private fileRestore!: HTMLInputElement;

  @query('#hiddenSaver')
  private hiddenSaver!: HTMLAnchorElement;

  @property({ type: Array })
  private zones!: Array<ZoneData>;

  @property({ type: Number })
  private zoneIndex = 0;

  @property({ type: String })
  private serverName: string = '';

  @property({ type: String })
  private authString: string = '';

  @property({ type: String })
  private _filename = '';

  @property({ type: String })
  private _file = '';

  @property({ type: Boolean })
  private allZones: boolean = true;

  @state()
  private message = '';

  @state()
  savedData: SavedData = {
    version: '',
    savedDate: new Date(),
    zones: [],
  };

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-block;
          padding: 10px;
          width: 95%;
        }

        .active {
          display: none;
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
        a {
          display: none;
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
        : html`<h2>${this.zones[this.zoneIndex]?.name}</h2>
            <time-zone .zone="${this.zones[this.zoneIndex]}"></time-zone>`}

      <mwc-fab class="save" title="Save" @click="${this._save}"></mwc-fab>
      <mwc-fab class="clear" title="Clear" @click="${this._clear}"></mwc-fab>
      <mwc-fab
        class="restore"
        title="Restore"
        @click="${this._restore}"
      ></mwc-fab>
      <a
        id="hiddenSaver"
        href="${this._file}"
        download="${this._filename}"
        hidden
        >THIS IS HIDDEN!</a
      >
      <input
        id="fileRestore"
        @change="${this._restoreFile}"
        accept=".gm3"
        type="file"
        hidden=""
      />
      <mwc-dialog id="invalid" heading="Invalid file type">
        <div>${this.message}</div>
        <mwc-button id="addUpdate" slot="secondaryAction" @click="${this.close}"
          >Cancel</mwc-button
        >
      </mwc-dialog>

      <mwc-dialog id="restore" heading="Restore timer data">
        <div>${this.message}</div>
        <mwc-button id="addUpdate" slot="secondaryAction" @click="${this.close}"
          >Cancel</mwc-button
        >
        <mwc-button slot="primaryAction" @click=${this.apply}>Apply</mwc-button>
      </mwc-dialog>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _clear() {
    const payload: Array<HgTimer> = [
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
    ];

    const zoneMode: HgMode = {
      objTimer: payload,
    };

    if (this.allZones)
      for (const zone of this.zones)
        updateHgMode(this.serverName, this.authString, zone.id, zoneMode);
    else
      updateHgMode(
        this.serverName,
        this.authString,
        this.zones[this.zoneIndex].id,
        zoneMode
      );
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.fabSave.icon = saveIcon;
    this.fabClear.icon = clearIcon;
    this.fabRestore.icon = restoreIcon;
  }

  async _save() {
    const rawData: SavedData = {
      version: VERSION_SIGNATURE,
      savedDate: new Date(),
      zones: [],
    };
    if (this.allZones) {
      for (const zone of this.zones) {
        rawData.zones.push({
          addr: zone.id,
          objTimer: zone.objTimer,
          name: zone.name,
        });
      }
      this._filename = 'all.gm3';
    } else {
      const zone = this.zones[this.zoneIndex];
      rawData.zones.push({
        addr: zone.id,
        objTimer: zone.objTimer,
        name: zone.name,
      });
      this._filename = `${zone.name}.gm3`;
    }

    const data = new Blob([JSON.stringify(rawData)], {
      type: 'application/json',
    });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (this._file !== null) {
      window.URL.revokeObjectURL(this._file);
    }
    this._file = window.URL.createObjectURL(data);

    await this.updateComplete;

    const event = new MouseEvent('click');
    this.hiddenSaver.dispatchEvent(event);
  }

  private _restore() {
    this.fileRestore.click();
  }

  // eslint-disable-next-line class-methods-use-this
  private _restoreFile() {
    const file = this.fileRestore.files;

    const reader = new FileReader();

    reader.onerror = (event: ProgressEvent<FileReader>) => {
      this.dispatchEvent(
        new CustomEvent('error', {
          bubbles: true,
          composed: true,
          detail: event.target?.error,
        })
      );
    };
    reader.onabort = (event: ProgressEvent<FileReader>) => {
      this.dispatchEvent(
        new CustomEvent('abort', {
          bubbles: true,
          composed: true,
          detail: event.target?.abort,
        })
      );
    };
    reader.onload = event => this.loadSavedFile(event);

    if (file && file.length > 0) {
      reader.readAsText(file[0]);
    }
  }

  loadSavedFile(event: ProgressEvent<FileReader>) {
    try {
      const data: SavedData = JSON.parse(
        event.target?.result as string
      ) as SavedData;

      if (data.version !== VERSION_SIGNATURE) {
        this.message = `Wrong file version. This file is version: ${data.version}`;
        this.savedData = { version: '', savedDate: new Date(), zones: [] };
        this.invalidFileDialog.show();
      } else {
        const names = data.zones.map(zone => zone.name);
        this.savedData = data;
        if (names.length === 1)
          this.message = `About to load timer for the following zone: ${names}`;
        else
          this.message = `About to load timers for the following zones:  ${names.join(
            ', '
          )}`;
        this.restoreFileDialog.show();
      }
    } catch (err) {
      this.message = 'Error in loading the file';
      this.savedData = { version: '', savedDate: new Date(), zones: [] };
      this.invalidFileDialog.show();
    }
  }

  private close() {
    this.invalidFileDialog.close();
    this.restoreFileDialog.close();
  }

  apply() {
    const { zones } = this.savedData;
    for (const zone of zones) {
      const zoneMode: HgMode = {
        objTimer: zone.objTimer,
      };
      updateHgMode(this.serverName, this.authString, zone.addr, zoneMode);
      this.restoreFileDialog.close();
    }
  }
}
