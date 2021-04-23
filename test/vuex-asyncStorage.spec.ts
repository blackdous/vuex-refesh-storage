import Vue from 'vue';
import Vuex, { Store, MutationPayload } from 'vuex';
// @ts-ignore
import Storage from 'dom-storage';

import { VuexRefeshStorage } from '../src/index';
import localForage from 'localforage';
jest.setTimeout(10000)

const objectStore: { [key: string]: any } = {}
const MockForageStorage = {
  _driver: 'objectStorage',
  _support: true,
  _initStorage() { },
  clear() { },
  getItem<T>(key: string): Promise<T> {
    return Promise.resolve<T>(objectStore[key])
  },
  iterate() { },
  key() { },
  keys() { },
  length() { return 111},
  removeItem() { },
  setItem<T>(key: string, data: T): Promise<T> {
    return Promise.resolve<T>((objectStore[key] = data))
  }
}

Vue.use(Vuex)

localForage.defineDriver(MockForageStorage as any)
localForage.setDriver('objectStorage')

const vuexRefeshStorage = new VuexRefeshStorage<any>({
  storage: localForage,
  asyncMode: true,
  key: 'vuex',
  reducer: (state) => ({ dog: state.dog }),
})

const store = new Store<any>({
  state: {
    dog: {
      barks: 0
    },
    cat: {
      mews: 0
    }
  },
  mutations: {
    dogBark(state) {
      state.dog.barks++
    },
    catMew(state) {
      state.cat.mews++
    }
  },
  plugins: [vuexRefeshStorage.install]
})
describe('Storage: AsyncStorage; Test: reducer, filter; Strict Mode: OFF', () => {
  it('should persist reduced state', async (done) => {
    await waitUntil(() => true);
    store.commit('dogBark')
    const currentStorage = await localForage.getItem('vuex')
    expect(currentStorage).toEqual({dog: { barks: 1 }})
    done();
  })
  it('should not persist non reduced state', async () => {
    store.commit('catMew')
    const currentStorage = await localForage.getItem('vuex');
    // console.log('currentStorage: ', currentStorage);
    expect(currentStorage).toEqual({dog: { barks: 1 }});
  })

  it("test: initAfterFunction", () => {
    const storage = new Storage();
    const store = new Store<any>({
      state: { original: "state" }
    });
    const initAfterFunction = jest.fn();
    const vuexRefeshStorage = new VuexRefeshStorage<any>({
      storage: storage,
      initAfterFunction
    });
    vuexRefeshStorage.install(store);
    expect(initAfterFunction).toBeCalledWith(store);
  })

  it("test: async initAfterFunction should call rehydrated if the replacement executed asynchronously", () => {
    jest.useFakeTimers();
    localForage.clear();
    const storage = new Storage();
    storage.setItem("vuex", JSON.stringify({ persisted: "json" }));

    setTimeout(() => {
      (new VuexRefeshStorage({ storage, initAfterFunction })).install(store);
    }, 600);
    const store = new Vuex.Store({ state: { original: "state" } });
    const initAfterFunction = jest.fn();

    jest.runAllTimers();
    const vuexRefeshStorage = new VuexRefeshStorage({ storage, initAfterFunction });
    vuexRefeshStorage.install(store);

    expect(initAfterFunction).toBeCalled();
    const rehydratedStore = initAfterFunction.mock.calls[0][0];
    expect(rehydratedStore.state.persisted).toBe("json");
  })
})

function waitUntil(condition: () => boolean): Promise<void> {
  return new Promise(async (resolve) => {
    let tries = 0
    while (!condition() && tries < 5) {
      await new Promise((_) => setTimeout(_, 2))
      tries++
    }
    resolve()
  })
}