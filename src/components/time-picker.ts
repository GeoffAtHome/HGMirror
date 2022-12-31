/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { LitElement, html, css, svg, PropertyValueMap } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement, query, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';
import '@material/mwc-button';
import { SharedStyles } from './shared-styles';

export interface TimeItem {
  x: number;
  y: number;
}

export interface TimeData {
  [index: string]: TimeItem;
}

const minutePos = (() => {
  const pos: TimeData = {};
  const segment = (2 * Math.PI) / 60;
  const offset = Math.PI / 2;

  for (let i = 0; i < 60; i++) {
    pos[i] = {
      x: 36 * Math.cos(segment * i - offset),
      y: 36 * Math.sin(segment * i - offset),
    };
  }
  return pos;
})();

const hourPos = (() => {
  const pos: TimeData = {};
  const segment = (2 * Math.PI) / 12;
  const offset = Math.PI / 3;

  for (let i = 0; i < 12; i++) {
    pos[i] = {
      x: 36 * Math.cos(segment * i - offset),
      y: 36 * Math.sin(segment * i - offset),
    };
  }

  for (let i = 0; i < 12; i++) {
    pos[i + 12] = {
      x: 24 * Math.cos(segment * i - offset),
      y: 24 * Math.sin(segment * i - offset),
    };
  }

  return pos;
})();

const durationPos = (() => {
  const pos: TimeData = {};
  const segment = (2 * Math.PI) / 12;
  const offset = Math.PI / 2;

  for (let i = 0; i < 12; i++) {
    pos[i] = {
      x: 36 * Math.cos(segment * i - offset),
      y: 36 * Math.sin(segment * i - offset),
    };
  }

  for (let i = 0; i < 12; i++) {
    pos[i + 12] = {
      x: 24 * Math.cos(segment * i - offset),
      y: 24 * Math.sin(segment * i - offset),
    };
  }

  return pos;
})();

const getHours24 = () => {
  const numberPos = hourPos;
  const numbers = [];

  for (let i = 0; i < 24; i++) {
    const j = i;
    numbers.push(svg`<text
                      class='clock-number'
                      alignment-baseline='middle'
                      text-anchor='middle'
                      transform='translate(${numberPos[j].x}, ${
      numberPos[j].y
    })'>
            ${i + 1}
        </text>`);
  }

  return numbers;
};

const getDurationHours = () => {
  const numberPos = durationPos;
  const numbers = [];

  for (let i = 0; i < 24; i++) {
    numbers.push(svg`<text
                      class='clock-number'
                      alignment-baseline='middle'
                      text-anchor='middle'
                      transform='translate(${numberPos[i].x}, ${numberPos[i].y})'>
            ${i}
        </text>`);
  }

  return numbers;
};

const getHours12 = () => {
  const numberPos = hourPos;
  const numbers = [];

  for (let i = 0; i < 12; i++) {
    const j = i;
    numbers.push(svg`<text
                      class='clock-number'
                      alignment-baseline='middle'
                      text-anchor='middle'
                      transform='translate(${numberPos[j].x}, ${
      numberPos[j].y
    })'>
            ${i + 1}
        </text>`);
  }

  return numbers;
};

const getMinutes = () => {
  const numberPos = minutePos;
  const numbers = [];

  for (let i = 0; i < 12; i++) {
    const j = i * 5;
    numbers.push(svg`<text
                      class='clock-number'
                      alignment-baseline='middle'
                      text-anchor='middle'
                      transform='translate(${numberPos[j].x}, ${numberPos[j].y})'>
            ${j}
        </text>`);
  }

  return numbers;
};

function keepInRange(num: number, min: number, max: number): number {
  if (num < min) {
    return min;
  }
  if (num > max) {
    return max;
  }
  return num;
}

function _pad(n: number) {
  return `${'0'.repeat(2)}${n}`.slice(`${n}`.length);
}

@customElement('time-picker')
export class TimePicker extends LitElement {
  @query('svg')
  private _svg!: SVGSVGElement;

  @property({ type: Boolean })
  private amPm = false;

  @property({ type: Boolean, reflect: true })
  private duration = false;

  @property({ type: String })
  time = '0:00';

  @state()
  _open = false;

  @property({ type: Number })
  _hour = 0;

  @property({ type: Number })
  _minute = 0;

  @state()
  _step = 0;

  @state()
  _amSelected = true;

  private _svgPt: any;

  private _mouseDown: boolean = false;

  static get styles() {
    return [
      SharedStyles,
      css`
        #time-picker {
          display: none;
          user-select: none;
          --time-picker-color: #3f51b5;
        }

        #time-picker.open {
          display: block;
        }

        .backdrop {
          position: fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.59);
        }

        .overlay {
          background: white;
          width: 300px;
          border-radius: 8px;
          overflow: hidden;
        }

        .digital-clock {
          height: 100px;
          background: var(--time-picker-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 55px;
          color: rgba(255, 255, 255, 0.54);
        }

        .hour,
        .minute,
        .am,
        .pm {
          cursor: pointer;
        }

        #time-picker.hour-selected .hour {
          color: white;
        }

        #time-picker.minute-selected .minute {
          color: white;
        }

        .digital-clock > .am-pm-selectors {
          margin-left: 20px;
          font-size: 18px;
        }

        #time-picker.am-selected .am {
          color: white;
        }

        #time-picker.pm-selected .pm {
          color: white;
        }

        .analog-clock-container {
          position: relative;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .analog-clock {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .clock-face {
          fill: #ededed;
        }

        .hand {
          stroke: var(--time-picker-color);
          stroke-width: 0.7;
        }

        .hand-marker {
          fill: var(--time-picker-color);
        }

        .clock-number {
          font-size: 6px;
        }

        .actions {
          display: flex;
          padding: 4px;
          align-items: center;
        }
      `,
    ];
  }

  render() {
    const { _open, _hour, _minute, _step, _amSelected, amPm } = this;

    const numberPos =
      _step === 0 ? (this.duration ? durationPos : hourPos) : minutePos;
    const selectedNum = _step === 0 ? _hour : _minute;

    // language=HTML
    return html`
      <div
        id="time-picker"
        class="${classMap({
          open: _open,
          'hour-selected': _step === 0,
          'minute-selected': _step === 1,
          'am-selected': _amSelected,
          'pm-selected': !_amSelected,
        })}"
      >
        <div class="backdrop">
          <div class="overlay">
            <div class="digital-clock">
              <div class="hour" @click="${() => this._setStep(0)}">
                ${_pad(_hour + (this.duration ? 0 : 1))}
              </div>
              <div>:</div>
              <div class="minute" @click="${() => this._setStep(1)}">
                ${_pad(_minute)}
              </div>
              ${amPm
                ? html`
                    <div class="am-pm-selectors">
                      <div class="am" @click="${() => this._setAM(true)}">
                        AM
                      </div>
                      <div class="pm" @click="${() => this._setAM(false)}">
                        PM
                      </div>
                    </div>
                  `
                : ''}
            </div>
            <div class="analog-clock-container">
              <svg
                class="analog-clock"
                viewBox="0 0 100 100"
                @mousedown="${this._onClockMouseDown}"
                @mousemove="${this._onClockMouseMove}"
                @mouseup="${this._onClockMouseUp}"
                @touchstart="${this._onClockTouchStart}"
                @touchmove="${this._onClockTouchMove}"
                @touchend="${this._onClockTouchEnd}"
              >
                <g transform="translate(50,50)">
                  <circle class="clock-face" r="44" />
                  <line
                    class="hand"
                    x1="0"
                    y1="0"
                    x2="${numberPos[selectedNum].x}"
                    y2="${numberPos[selectedNum].y}"
                  />
                  <circle class="hand-marker" r="1" />
                  <circle
                    class="hand-marker"
                    r="5"
                    transform="translate(${numberPos[selectedNum]
                      .x}, ${numberPos[selectedNum].y})"
                  />
                  ${this._step === 1
                    ? getMinutes()
                    : this._amSelected
                    ? this.duration
                      ? getDurationHours()
                      : getHours24()
                    : getHours12()}
                </g>
              </svg>
            </div>
            <div class="actions">
              <div style="flex: 1;"></div>
              <mwc-button @click="${() => this._onCancel()}">Cancel</mwc-button>
              <mwc-button @click="${() => this._onConfirm()}">Ok</mwc-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    this._svgPt = this._svg.createSVGPoint();
  }

  protected updated(
    changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProps.has('time')) {
      const parts = this.time.split(':');
      this._hour = keepInRange(Number(parts[0]), 0, 23);
      this._minute = keepInRange(Number(parts[1]), 0, 59);
    }
  }

  show() {
    this._open = true;
  }

  _onCancel() {
    this._open = false;
    this.dispatchEvent(new Event('time-picker-cancelled'));
  }

  _onConfirm() {
    this._open = false;
    this.time = `${_pad(this._hour + (this.duration ? 0 : 1))}:${_pad(
      this._minute
    )}${this.amPm ? (this._amSelected ? ' AM' : ' PM') : ''}`;
    this.dispatchEvent(new Event('time-picker-ok'));
  }

  _updateClock(x: number, y: number) {
    this._svgPt.x = x;
    this._svgPt.y = y;

    const cursorPt = this._svgPt.matrixTransform(
      this._svg.getScreenCTM()?.inverse()
    );

    const halfWidth = 100 / 2;

    // Make relative to center
    cursorPt.x -= halfWidth;
    cursorPt.y -= halfWidth;

    let closestNumber = 0;
    let minDist = Infinity;
    const numberPos =
      this._step === 0 ? (this.duration ? durationPos : hourPos) : minutePos;

    for (let i = 0; i < (this._step === 0 ? (this.amPm ? 12 : 24) : 60); i++) {
      const dist = Math.hypot(
        numberPos[i].x - cursorPt.x,
        numberPos[i].y - cursorPt.y
      );

      if (dist < minDist) {
        minDist = dist;
        closestNumber = i;
      }
    }

    if (this._step === 0) {
      this._hour = closestNumber;
    } else {
      this._minute = closestNumber;
    }
  }

  _onClockMouseDown(e: MouseEvent) {
    this._mouseDown = true;
    this._updateClock(e.clientX, e.clientY);
  }

  _onClockMouseMove(e: MouseEvent) {
    if (this._mouseDown) {
      this._updateClock(e.clientX, e.clientY);
    }
  }

  _onClockMouseUp(_e: MouseEvent) {
    this._mouseDown = false;
    if (this._step === 0) {
      this._step = 1;
    }
  }

  _onClockTouchStart(e: TouchEvent) {
    e.preventDefault();
    this._mouseDown = true;
    this._updateClock(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }

  _onClockTouchMove(e: TouchEvent) {
    e.preventDefault();
    if (this._mouseDown) {
      this._updateClock(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
    }
  }

  _onClockTouchEnd(_e: TouchEvent) {
    this._mouseDown = false;
    if (this._step === 0) {
      this._step = 1;
    }
  }

  _setStep(step: number) {
    this._step = step;
  }

  _setAM(am: boolean) {
    this._amSelected = am;
  }
}
