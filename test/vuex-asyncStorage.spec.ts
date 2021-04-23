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

const vuexPersist = new VuexRefeshStorage<any>({
  storage: localForage,
  asyncMode: true,
  key: 'dafuq',
  reducer: (state) => ({ dog: state.dog }),
  filter: (mutation) => (mutation.type === 'dogBark')
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
  plugins: [vuexPersist.install]
})
describe('Storage: AsyncStorage; Test: reducer, filter; Strict Mode: OFF', () => {
  it('should persist reduced state', async (done) => {
    await waitUntil(() => true);

    store.commit('dogBark')
    const currentStorage = await localForage.getItem('dafuq')
    console.log('dogBark', currentStorage, store.state)
    done();
  })
  it('should not persist non reduced state', async () => {
    store.commit('catMew')
    const currentStorage = await localForage.getItem('dafuq')
    console.log('currentStorage: ', currentStorage);
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