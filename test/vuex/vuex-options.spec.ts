import Vuex, { Store, MutationPayload } from 'vuex';
// @ts-ignore
import Storage from 'dom-storage';

import { VuexRefeshStorage } from '../../src/index';

const newJSON = require('flatted');


const storage = new Storage();
const objStorage: any = {}

describe("test: options", () => {
  it("test: options custome", () => {
    const vuexRefeshStorage = new VuexRefeshStorage({
      asyncMode: true,
      initStorage: false,
      overwrite: true,
      key: 'custumer', 
      storage
    });
    const store = new Vuex.Store({ state: {} });
    vuexRefeshStorage.install(store)

    expect(vuexRefeshStorage.asyncMode).toBe(true);
    expect(vuexRefeshStorage.initStorage).toBe(false);
    expect(vuexRefeshStorage.overwrite).toBe(true);
    expect(vuexRefeshStorage.key).toBe('custumer');
    expect(storage.getItem('custumer')).toBe(null);
  });

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
  });

  it("test: modules", () => {
    storage.clear();
    const vuexRefeshStorage = new VuexRefeshStorage({
      key: 'custom',
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
  });

  it("test: flatted to should not clone circular objects", () => {
    storage.clear();
    const vuexRefeshStorage = new VuexRefeshStorage({
      storage,
      jsonParse: newJSON
    })
    // console.log('newJSON: ', newJSON);
    let initState = {
      normal: "default",
      circleState: {}
    }
    initState.circleState = initState;
    const store = new Vuex.Store({
      state: {
        circularState: {}
      },
      mutations: {
        updateState (state) {
          state.circularState = initState
        }
      }
    });
    vuexRefeshStorage.install(store);
    store.commit('updateState')
    expect(storage.getItem('vuex')).toBe(newJSON.stringify({ circularState: initState }))
  });

  it("should not persist whole store if modules array is empty", () => {
    storage.clear();
    const store = new Vuex.Store({
      state: {
        circularState: {
          name: ''
        },
        default: '123123'
      },
      mutations: {
        updateState (state) {
          state.circularState.name = '12312'
        }
      }
    });
    const vuexRefeshStorage = new VuexRefeshStorage({
      key: 'common',
      modules: [],
      storage
    });
    vuexRefeshStorage.install(store);
    store.commit('updateState');
    expect(storage.getItem('common')).toBe(JSON.stringify({}))
  });

  it("should not persist whole store if modules array", () => {
    storage.clear();
    const store = new Vuex.Store({
      state: {
        circularState: {
          name: ''
        },
        default: '123123'
      },
      mutations: {
        updateState (state) {
          state.circularState.name = '12312'
        }
      }
    });
    const vuexRefeshStorage = new VuexRefeshStorage({
      key: 'common',
      modules: ['circularState'],
      storage
    });
    vuexRefeshStorage.install(store);
    store.commit('updateState');
    // console.log('store: ', store.state, vuexRefeshStorage.storage.getItem('common'));
    expect(storage.getItem('common')).toBe(JSON.stringify({circularState: {
      name: '12312'
    }}))
  });

  it("should not persist null values", () => {
    storage.clear();
    const store = new Vuex.Store({
      state: {
        orignal: 'default',
        default: null
      },
      mutations: {
        updateState (state) {
          state.orignal = '222'
        }
      }
    });
    const vuexRefeshStorage = new VuexRefeshStorage({
      storage
    });
    vuexRefeshStorage.install(store);
    store.commit('updateState');
    expect(storage.getItem('vuex')).toBe(JSON.stringify({
      orignal: '222',
      default: null
    }))
  });
  it("should not merge array values when rehydrating by default", () => {
    storage.clear();

    storage.setItem("vuex", JSON.stringify({persisted: ["json"]}));

    const store = new Vuex.Store({ state: { persisted: ["state"] } });
    store.replaceState = jest.fn();
    store.subscribe = jest.fn();

    const vuexRefeshStorage = new VuexRefeshStorage({
      storage
    });

    vuexRefeshStorage.install(store);

    expect(store.replaceState).toBeCalledWith({
      persisted: ["state", "json"]
    });
    expect(store.subscribe).toBeCalled()
  });

it("should apply a custom arrayMerger function", () => {
  storage.clear();

  storage.setItem("vuex", JSON.stringify({ persisted: [1, 2] }));

  const store = new Vuex.Store({ state: { persisted: [1, 2, 3] } });
  store.replaceState = jest.fn();
  store.subscribe = jest.fn();

  const vuexRefeshStorage = new VuexRefeshStorage({
    storage,
    deepMergeOptions: {
      arrayMerge: function (store:any, saved:any) {
        return ["hello!"];
      }
    }
  });
  vuexRefeshStorage.install(store)
  expect(store.replaceState).toBeCalledWith({
    persisted: ["hello!"],
  });
  expect(store.subscribe).toBeCalled();
  });

  // it("rehydrates store's state through the configured getter", () => {
  //   storage.clear();
  //   const store = new Vuex.Store({
  //     state: {}
  //   });
  //   store.replaceState = jest.fn();
  //   const vuexRefeshStorage = new VuexRefeshStorage({
  //     storage,
  //     getState: (key, storage) => () => ({ getter: "item" })
  //   });
  //   vuexRefeshStorage.install(store);
  //   expect(store.replaceState).toBeCalledWith({ getter: "item" });
  // })
  it("persist the changed state back through the configured setter", () => {
    expect.assertions(1);
    storage.clear();

    const store = new Vuex.Store({
      state: {
        setter: ''
      },
      mutations: {
        setCommit (state) {
          state.setter = "item"
        }
      }
    });
    const vuexRefeshStorage = new VuexRefeshStorage({
      storage,
      setState: (key, state) => {
        expect(state).toEqual({ setter: "item" })
      }
    });

    vuexRefeshStorage.install(store);
    store.commit('setCommit')
  });

  it("filters to specific mutations", () => {
    storage.clear();
    const store = new Vuex.Store({
      state: {
        normal: ''
      },
      mutations: {
        defaultCommit (state, newVal) {
          state.normal = newVal
        },
        filter (state, newVal) {
          state.normal = newVal
        }
      }
    });
    const vuexRefeshStorage = new VuexRefeshStorage({
      storage,
      filter: (mutation) => mutation.type === 'filter'
    });
    vuexRefeshStorage.install(store);
    store.commit('defaultCommit', 'state');
    expect(storage.getItem('vuex')).toBeNull()
    store.commit('filter', 'state');
    expect(storage.getItem('vuex')).toBe(JSON.stringify({normal: 'state'}))
  })

  it("should call rehydrated callback once the state is replaced", () => {
    storage.clear();

    storage.setItem('vuex', JSON.stringify({ persisted: "json" }));
    const store = new Vuex.Store({
      state: { original: "state" }
    });
    const initAfterFunction = jest.fn();

    const vuexRefeshStorage = new VuexRefeshStorage({
      storage,
      initAfterFunction
    });
    vuexRefeshStorage.install(store);

    expect(initAfterFunction).toBeCalledWith(store);
  });
})