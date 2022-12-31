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

function keepInRange(num: number, min: number, max: number): number {
  if (num < min) {
    return min;
  }
  if (num > max) {
    return max;
  }
  return num;
}

@customElement('temperature-picker')
export class TemperaturePicker extends LitElement {
  @query('svg')
  private _svg!: SVGSVGElement;

  @property({ type: Number })
  value = 10;

  @state()
  minTemp = 4.0;

  @state()
  maxTemp = 32.0;

  @state()
  private tempStep = 0.5;

  @state()
  _open = false;

  @property({ type: Number })
  _value = 10.0;

  private _svgPt: any;

  private _mouseDown: boolean = false;

  private _numberPos() {
    const pos: TimeData = {};
    const segment = (1.5 * Math.PI) / (this.maxTemp - this.minTemp);
    const offset = 1.5 * Math.PI - segment / 2;

    for (let i = this.minTemp; i <= this.maxTemp; i += this.tempStep) {
      pos[i] = {
        x: 36 * Math.cos(segment * i - offset),
        y: 36 * Math.sin(segment * i - offset),
      };
    }
    return pos;
  }

  private _getNumbers() {
    const numbers = [];

    for (let i = this.minTemp; i <= this.maxTemp; i += 2) {
      const j = i;
      numbers.push(svg`<text
                        class='clock-number'
                        alignment-baseline='middle'
                        text-anchor='middle'
                        transform='translate(${this.numberPos[j].x}, ${this.numberPos[j].y})'>
              ${j}
          </text>`);
    }

    return numbers;
  }

  private numberPos: TimeData = this._numberPos();

  private getNumbers = this._getNumbers();

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
    const { _open, _value } = this;

    const selectedNum = _value;

    // language=HTML
    return html`
      <div
        id="time-picker"
        class="${classMap({
          open: _open,
        })}"
      >
        <div class="backdrop">
          <div class="overlay">
            <div class="digital-clock">
              <div class="hour">${this._value}°C</div>
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
                    x2="${this.numberPos[selectedNum].x}"
                    y2="${this.numberPos[selectedNum].y}"
                  />
                  <circle class="hand-marker" r="1" />
                  <circle
                    class="hand-marker"
                    r="5"
                    transform="translate(${this.numberPos[selectedNum]
                      .x}, ${this.numberPos[selectedNum].y})"
                  />
                  ${this.getNumbers}
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
    if (changedProps.has('value')) {
      this._value = keepInRange(this.value, this.minTemp, this.maxTemp);
    }

    if (
      changedProps.has('minTemp') ||
      changedProps.has('maxTemp') ||
      changedProps.has('tempStep')
    ) {
      this.numberPos = this._numberPos();
      this.getNumbers = this._getNumbers();
    }
  }

  show() {
    this._open = true;
  }

  _onCancel() {
    this._open = false;
    this.dispatchEvent(new Event('temperature-picker-cancelled'));
  }

  _onConfirm() {
    this._open = false;
    this.value = this._value;
    this.dispatchEvent(new Event('temperature-picker-ok'));
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

    for (let i = this.minTemp; i <= this.maxTemp; i += this.tempStep) {
      const dist = Math.hypot(
        this.numberPos[i].x - cursorPt.x,
        this.numberPos[i].y - cursorPt.y
      );

      if (dist < minDist) {
        minDist = dist;
        closestNumber = i;
      }
    }
    this._value = closestNumber;
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
  }
}
