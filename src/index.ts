/*
 * @Descripttion: 
 * @Author: 19080088
 * @Date: 2021-04-19 08:51:29
 * @LastEditors: 19080088
 * @LastEditTime: 2021-04-20 17:52:18
 */
import { Mutation, MutationPayload, Payload, Plugin, Store } from 'vuex';
import { AsyncStorage } from './AsyncStorage';
import DefaultStorage from './DefaultStorage';
import { Options } from './Options';
import merge from "deepmerge";

const typeStr = function (value:any) {
  const typeSourceStr = Object.prototype.toString.call(value)
  const len = typeSourceStr.length;
  return typeSourceStr.substring(8, len -1);
}

export class VuexRefeshStorage<State> implements Options<State> {

  /**
   * item name
   */
  public key: string
  /**
   * store module list
   */
  public modules: string[]
  /**
   * window.localstorage
   */
  public storage: Storage | AsyncStorage | DefaultStorage
  public async: boolean
  public jsonParse: JSON
  public initStorage: boolean
  public overwrite: boolean

  
  public getState: (key: string, storage: Storage | AsyncStorage | DefaultStorage) => Promise<void> | void
  public setState: (key: string, state: any, storage: Storage | AsyncStorage | DefaultStorage) => Promise<void> | void
  public reducer: (state: State) => Partial<State>
  public filter: (mutation: Payload) => boolean
  public subscribe: (store: Store<State>) => (handler: (mutation: any, state: State) => void) => void

  /**
   * store plugin functions
   */
  public install: Plugin<State>

  /**
   * Creates a subscriber on the store. automatically is used
   * when this is used a vuex plugin. Not for manual usage.
   * @param store
   */
  private subscriber = (store: Store<State>) =>
    (handler: (mutation: MutationPayload, state: State) => any) => store.subscribe(handler)

  public constructor(options?: Options<State>) {
    // init options
    options = options || {};

    this.storage = options.storage || (window && window.localStorage);
    this.key = options.key || "normal";
    
    this.filter = options.filter || ((mutation) => true)

    const jsonParse = options.jsonParse || JSON 

    this.async = options.async || false

    this.initStorage = options.initStorage || false

    this.overwrite = options.overwrite || true

    this.setState = (
      options.setState ? 
        options.setState : 
        (key: string, state: {}, storage: AsyncStorage) =>
          storage.setItem(key, this.async ? merge({}, state || {}, {}) : jsonParse.stringify(state) as any)
    )

    if (this.async) {
      this.getState = options.getState ?
        options.getState
        : ((key: string, storage: AsyncStorage) => 
          storage.getItem(key).then((value:any) =>
            typeStr(value) === 'String' ?
              jsonParse.parse(value || '{}')
              : (value || {})
          )
        )
        this.install = (store: Store<State>) => {
          
        }
    } else {
      this.getState = options.getState ?
        options.getState
        : ((key: string, storage: Storage) => {
          const value = storage.getItem(key)
          if (typeStr(value) === 'String') {
            return jsonParse.parse(value || '{}')
          } else {
            return value || {}
          }
        })

        this.install = (store: Store<State>) => {
          const initState = this.initStorage ? this.getState(this.key, this.storage) : {}
          const reState = this.overwrite ? initState : merge(store.state, initState || {}, {})
          store.replaceState(reState as State)

          this.subscribe(store)((mutation: MutationPayload, state: State) => {
            if (this.filter(mutation)) {
              this.setState(this.key, this.reducer(state), this.storage)
            }
          })
        }
    }
    /**
     * How this works is -
     *  1. If there is options.reducer function, we use that, if not;
     *  2. We check options.modules;
     *    1. If there is no options.modules array, we use entire state in reducer
     *    2. Otherwise, we create a reducer that merges all those state modules that are
     *        defined in the options.modules[] array
     * @type {((state: S) => {}) | ((state: S) => S) | ((state: any) => {})}
     */
     this.reducer = (
      (options.reducer != null)
        ? options.reducer
        : (
          (options.modules == null)
            ? ((state: State) => state)
            : (
              (state: any) =>
                (options!.modules as string[]).reduce((a, i) =>
                  merge(a, { [i]: state[i] }, {}), {/* start empty accumulator*/ })
            )
        )
      )
  }
}