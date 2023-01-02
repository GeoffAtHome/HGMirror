/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css, PropertyValueMap } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement, query } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';
import './time-picker';
import './temperature-picker';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-formfield';
import '@material/mwc-button';
// eslint-disable-next-line import/no-duplicates
import { Checkbox } from '@material/mwc-checkbox';
import { SharedStyles } from './shared-styles';
// eslint-disable-next-line import/no-duplicates
import '@material/mwc-checkbox';
import { updateHgMode } from '../reducers/hg-data';
import { HgMode, ZoneData, ZoneMode } from '../actions/hg-data';

@customElement('boost-dialog')
export class BootDialog extends LitElement {
  @query('mwc-icon-button')
  @query('#temperature')
  private temperature!: any;

  @query('#time')
  private time!: any;

  @query('time-picker')
  private timePicker!: any;

  @query('temperature-picker')
  private temperaturePicker!: any;

  @query('mwc-dialog')
  private boostDialog: any;

  @property({ type: String })
  private serverName: string = '';

  @property({ type: String })
  private authString: string = '';

  @property({ type: Object })
  private zone!: ZoneData;

  @property({ type: Number })
  private temp = 20.0;

  @property({ type: Boolean })
  private nextTimePeriod = false;

  @property({ type: String })
  private duration = '01:00';

  @property({ type: Boolean })
  _open = false;

  static get styles() {
    return [
      SharedStyles,
      css`
        .active {
          display: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <mwc-dialog heading="Boost ${this.zone.name}">
        <div>
          <div
            class="${classMap({
              active: this.zone.isSwitch,
            })}"
          >
            <mwc-textfield
              id="temperature"
              label="Temperature"
              value="${this.temp}"
              @click=${this.openTemperaturePicker}
              type="text"
            ></mwc-textfield>
          </div>
          <div
            class="${classMap({
              active: this.nextTimePeriod,
            })}"
          >
            <mwc-textfield
              id="time"
              label="Time"
              value="${this.duration}"
              @click=${this.openTimePicker}
            ></mwc-textfield>
          </div>
          <mwc-formfield label="Until next time period"
            ><mwc-checkbox
              alignStart
              @change=${this.nextTimePeriodChanged}
            ></mwc-checkbox
          ></mwc-formfield>
        </div>
        <mwc-button id="addUpdate" slot="secondaryAction" @click="${this.close}"
          >Cancel</mwc-button
        >
        <mwc-button slot="primaryAction" @click=${this.apply}>Apply</mwc-button>
      </mwc-dialog>
      <temperature-picker
        .value=${this.temp}
        duration
        @temperature-picker-cancelled=${this.temperaturePickerCancelled}
        @temperature-picker-ok=${this.temperaturePickerOK}
      ></temperature-picker>
      <time-picker
        .time=${this.duration}
        duration
        @time-picker-cancelled=${this.timePickerCancelled}
        @time-picker-ok=${this.timePickerOK}
      ></time-picker>
    `;
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (this._open) this.boostDialog.show();
    else this.boostDialog.close();
  }

  private close() {
    this._open = false;
  }

  openTemperaturePicker(_event: Event) {
    this.boostDialog.close();
    this.temperaturePicker.show();
  }

  openTimePicker(_event: Event) {
    this.boostDialog.close();
    this.timePicker.show();
  }

  // eslint-disable-next-line class-methods-use-this
  timePickerCancelled(_e: Event) {
    this.boostDialog.show();
  }

  // eslint-disable-next-line class-methods-use-this
  timePickerOK(event: Event) {
    this.boostDialog.show();

    const target = event.target as any;
    this.time.value = target.time;
  }

  // eslint-disable-next-line class-methods-use-this
  temperaturePickerCancelled(_e: Event) {
    this.boostDialog.show();
  }

  // eslint-disable-next-line class-methods-use-this
  temperaturePickerOK(event: Event) {
    this.boostDialog.show();

    const target = event.target as any;
    this.temperature.value = target.value;
  }

  nextTimePeriodChanged(event: any) {
    this.nextTimePeriod = event.target.checked;
  }

  apply() {
    const parts = this.duration.split(':');
    const timeInSeconds = Number(parts[0]) * 60 * 60 + Number(parts[1]) * 60;
    const zoneMode: HgMode = {
      iMode: ZoneMode.ModeBoost,
      fBoostSP: this.zone.isSwitch ? 1 : this.temp,
      iBoostTimeRemaining: timeInSeconds,
    };
    updateHgMode(this.serverName, this.authString, this.zone.id, zoneMode);
    this.boostDialog.close();
  }
}
