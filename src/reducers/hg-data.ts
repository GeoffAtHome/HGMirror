/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Reducer } from 'redux';
import {
  HgDataState,
  HgData,
  HG_DATA,
  hgDataSetData,
  ZoneData,
  ZoneMode,
} from '../actions/hg-data';
import { RootAction, RootState, store } from '../store';

const defaultData: HgData = {
  data: {},
};

const INITIAL_STATE: HgDataState = {
  _data: defaultData,
  _zones: [],
};

const hgData: Reducer<HgDataState, RootAction> = (
  // eslint-disable-next-line default-param-last
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case HG_DATA:
      return {
        ...state,
        _data: action._data,
        _zones: action._zones,
      };

    default:
      return state;
  }
};

export default hgData;

// Per Redux best practices, the shop data in our store is structured
// for efficiency (small size and fast updates).
//
// The _selectors_ below transform store data into specific forms that
// are tailored for presentation. Putting this logic here keeps the
// layers of our app loosely coupled and easier to maintain, since
// views don't need to know about the store's internal data structures.
//
// We use a tiny library called `reselect` to create efficient
// selectors. More info: https://github.com/reduxjs/reselect.

export const hgDataSelector = (state: RootState) => state.hgData;

function LogError(text: string, err: any) {
  // eslint-disable-next-line no-console
  console.error(`${text}: ${err}`);
}

export async function fetchHgData(serverName: string, authString: string) {
  const url = serverName;
  let results: any = {};
  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authString,
      },
    });

    if (result.status === 200) {
      results = await result.json();
      const zone: any = results.data.sort(
        (a: { iPriority: number }, b: { iPriority: number }) =>
          a.iPriority - b.iPriority
      );
      const zones: Array<ZoneData> = [];
      if (zone.entries !== undefined) {
        for (const [x, item] of zone.entries()) {
          const zoneItem: ZoneData = {
            name: item.strName,
            id: '',
            mode: item.iMode,
            isSwitch: item.nodes[0].childValues.SwitchBinary !== undefined,
            boost:
              item.iMode === ZoneMode.ModeBoost ? item.iBoostTimeRemaining : -1,
          };
          zones.push(zoneItem);
        }
      }
      // Remove the first entry
      zones.shift();

      store.dispatch(hgDataSetData(results, zones));
    }
  } catch (err) {
    LogError(JSON.stringify(err), err);
  }
}
