import Vue from 'vue';
import Vuex from 'vuex';
import flatted from 'flatted';
// @ts-ignore
import Storage from 'dom-storage';


import { VuexRefeshStorage } from '../src/index';

Vue.use(Vuex)

const storage = new Storage();

describe("test: options", () => {
  it("test: options custome", () => {
    const vuexRefeshStorage = new VuexRefeshStorage({
      async: true,
      initStorage: false,
      overwrite: true,
      key: 'custumer', 
      storage
    });
    const store = new Vuex.Store({ state: {} });
    vuexRefeshStorage.install(store)

    expect(vuexRefeshStorage.async).toBe(true);
    expect(vuexRefeshStorage.initStorage).toBe(false);
    expect(vuexRefeshStorage.overwrite).toBe(true);
    expect(vuexRefeshStorage.key).toBe('custumer');
    expect(storage.getItem('custumer')).toBe(null);
  })

  it("test: options.initStorage: false or true ", () => {
    // options.initStorage: true
    storage.setItem('vuex', JSON.stringify({ normal: 'default' }))
    const vuexRefeshStorage = new VuexRefeshStorage({
      initStorage: true,
      storage
    })
    const store = new Vuex.Store({ state: {} });

    vuexRefeshStorage.install(store)
    expect(store.state).toEqual({ normal: 'default' });

    // options.initStorage: false
    storage.clear();
    storage.setItem('vuex', JSON.stringify({ normal: 'default' }))
    const vuexRefeshStorageTwo = new VuexRefeshStorage({
      initStorage: false,
      storage
    })
    const storeTwo = new Vuex.Store({ state: {} });
    vuexRefeshStorageTwo.install(storeTwo);
    expect(storeTwo.state).toEqual({});

  });

  it("test: Options.overwrite: true or false", () => {
    storage.setItem('vuex', JSON.stringify({ normal: 'default' }))
    const vuexRefeshStorage = new VuexRefeshStorage({
      storage
    })
    const store = new Vuex.Store({ state: {
      common: 'common'
    } });
    vuexRefeshStorage.install(store)
    expect(store.state).toEqual({
      normal: 'default',
      common: 'common'
    })

    storage.clear()
    storage.setItem('vuex', JSON.stringify({ normal: 'default' }))
    const vuexRefeshStorageTwo = new VuexRefeshStorage({
      overwrite: true,
      storage
    })
    const storeTwo = new Vuex.Store({ state: {
      common: 'common'
    } });
    vuexRefeshStorageTwo.install(storeTwo)
    expect(storeTwo.state).toEqual({
      normal: 'default'
    })
  })

  it("test: modules", () => {
    storage.clear();
    const vuexRefeshStorage = new VuexRefeshStorage({
      key: 'custom',
      modules: ['custom'],
      storage
    })
    const store = new Vuex.Store({ 
      modules: {
        custom: {
          namespaced: true,
          state: {
            change: ''
          },
          mutations: {
            changeState (state) {
              state.change = "state"
            }
          }
        }
      }
      
    })
    vuexRefeshStorage.install(store);

    store.commit('custom/changeState');
    expect(storage.getItem('custom')).toBe(JSON.stringify({custom: { change: "state" }}))
  })

  it("test: flatted to should not clone circular objects", () => {
    storage.clear();
    const vuexRefeshStorage = new VuexRefeshStorage({
      storage
    })
    const initState = {
      normal: "default"
    }
  })
})