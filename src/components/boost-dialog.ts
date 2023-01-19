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
import { SharedStyles } from './shared-styles';
// eslint-disable-next-line import/no-duplicates
import '@material/mwc-checkbox';
import { updateHgMode } from '../reducers/hg-data';
import { HgMode, ZoneData, ZoneMode } from '../actions/hg-data';

function timeInSecondsToString(time: number) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const lmz = hours < 10 ? '0' : '';
  const lsz = minutes < 10 ? '0' : '';
  return `${lmz + hours}:${lsz}${minutes}`;
}

@customElement('boost-dialog')
export class BootDialog extends LitElement {
  @query('#tempInput')
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

  @property({ type: Boolean })
  private nextTimePeriod = false;

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
              id="tempInput"
              label="Temperature"
              value="${this.zone.fBoostSP}"
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
              value="${timeInSecondsToString(this.zone.iOverrideDuration)}"
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
        .value=${this.zone.fBoostSP}
        duration
        @temperature-picker-cancelled=${this.temperaturePickerCancelled}
        @temperature-picker-ok=${this.temperaturePickerOK}
      ></temperature-picker>
      <time-picker
        .time=${timeInSecondsToString(this.zone.iOverrideDuration)}
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

  timePickerCancelled(_e: Event) {
    this.boostDialog.show();
  }

  timePickerOK(event: Event) {
    this.boostDialog.show();

    const target = event.target as any;
    this.time.value = target.time;
  }

  temperaturePickerCancelled(_e: Event) {
    this.boostDialog.show();
  }

  temperaturePickerOK(event: Event) {
    this.boostDialog.show();

    const target = event.target as any;
    this.temperature.value = target.value;
  }

  nextTimePeriodChanged(event: any) {
    this.nextTimePeriod = event.target.checked;
  }

  apply() {
    const parts = this.time.value.split(':');
    const timeInSeconds = Number(parts[0]) * 60 * 60 + Number(parts[1]) * 60;
    const zoneMode: HgMode = {
      iMode: ZoneMode.ModeBoost,
      fBoostSP: this.zone.isSwitch ? 1 : Number(this.temperature.value),
      iBoostTimeRemaining: timeInSeconds,
      iOverrideDuration: timeInSeconds,
    };
    updateHgMode(this.serverName, this.authString, this.zone.id, zoneMode);
    this.boostDialog.close();
  }
}
