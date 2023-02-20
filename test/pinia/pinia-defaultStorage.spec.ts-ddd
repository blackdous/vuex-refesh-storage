import { createStore } from 'vuex';
// @ts-ignore
import Storage from 'dom-storage';

import { VuexRefeshStorage } from '../../src/index';

const storage = new Storage();

describe('defaultStorage test', () => {
  it("can be created with the default options", () => {
    // window.localStorage = storage;
    expect(() => new VuexRefeshStorage({storage})).not.toThrow()
  })
  it("initstate and subscribes", () => {
    storage.setItem("vuex", JSON.stringify({ normal: 'default' }));

    const store = createStore({ state: { common: 'state' } });
    store.replaceState = jest.fn();
    store.subscribe = jest.fn();

    const vuexRefeshStorage = new VuexRefeshStorage({storage});
    vuexRefeshStorage.install(store);

    expect(store.replaceState).toBeCalledWith({
      common: 'state',
      normal: 'default',
    })
    expect(store.subscribe).toBeCalled()
  })

  it("defaultStorage; Test: getState, reducer, filter", () => {
    storage.clear()
    const vuexRefeshStorage = new VuexRefeshStorage({storage});
    const store = createStore({
      state: {
        count: 0,
        age: 20
      },
      mutations: {
        addCount (state:any) {
          state.count++
        }
      },
      plugins: [vuexRefeshStorage.install]
    });
    const getStorageState = () => JSON.parse(storage.getItem('vuex'))

    store.commit('addCount')
    expect(getStorageState().count).toBe(1)
    expect(vuexRefeshStorage.getState('vuex', storage)).toStrictEqual({count: 1, age: 20})
  })
})
