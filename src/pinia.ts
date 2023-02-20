import { Pinia, Store, PiniaPlugin, PiniaPluginContext } from 'pinia';
// import { MutationPayload, Payload, Plugin, Store } from 'vuex';
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
   * global.JSON、LocalForage、sessionStorage、localForage
   */
  public storage: Storage | AsyncStorage | DefaultStorage
  // storage must be async
  public asyncMode: boolean
  // global.JSON or flatted { parse, stringify }
  public jsonParse: JSON
  // get storage state init to vue state
  public initStorage: boolean
  // init state use deepmerge
  public overwrite: boolean

  // use deepMerge object merge(target, source, options)
  public deepMergeOptions: object

  public getState: (key: string, storage: Storage | AsyncStorage | DefaultStorage) => Promise<void> | void | Promise<State> | State
  public setState: (key: string, state: any, storage: Storage | AsyncStorage | DefaultStorage) => Promise<void> | void
  public reducer: (state: State) => Partial<State>
  public filter: (mutation: Payload) => boolean
  public initAfterFunction: (store: Pinia) => void


  /**
   * store plugin functions
   */
  public install: PiniaPlugin<State>
  /**
   * Creates a subscriber on the store. automatically is used
   * when this is used a vuex plugin. Not for manual usage.
   * @param store
   */
  public subscribe = (store: Store<State>) =>
    (handler: (mutation: MutationPayload, state: State) => any) => store.subscribe(handler)

  public constructor(options?: Options<State>) {
    // init options
    options = options || {};

    this.storage = options.storage || (window && window.localStorage);
    this.key = options.key || "vuex";
    this.deepMergeOptions = options.deepMergeOptions || {}
    
    this.jsonParse = options.jsonParse || JSON
    
    this.asyncMode = options.asyncMode || false
    this.initStorage = options.initStorage === undefined ? true : options.initStorage
    this.overwrite = options.overwrite || false
    
    this.filter = options.filter || ((mutation) => true)

    this.initAfterFunction = options.initAfterFunction || function () {}

    // setState
    this.setState = (
      options.setState ? 
        options.setState : 
        (key: string, state: {}, storage: AsyncStorage) =>
          storage.setItem(key, this.asyncMode ? merge({}, state || {}, this.deepMergeOptions) : this.jsonParse.stringify(state) as any)
    )

    if (this.asyncMode) {
      this.getState = options.getState ? options.getState
      : (key: string, storage: AsyncStorage) => {
        storage.getItem(key)?.then((value:any) => {
          typeStr(value) === 'String' ? this.jsonParse.parse(value || '{}'): (value || {})
        })
      }
      /**
       * vuex plugin install Function use init 
       */
      this.install = async (store: Store<State>) => {
        try {
          const initState = await this.getState(this.key, this.storage);
          const currentState = this.initStorage ? initState : {};
          const reState = this.overwrite ? initState : merge(store.state, currentState || {}, this.deepMergeOptions);
          // store.replaceState(reState as State);
          (this.initAfterFunction)(store);
          this.subscribe(store)((mutation: MutationPayload, state: State) => {
            if (this.filter(mutation)) {
              this.setState(this.key, this.reducer(state), this.storage);
            }
          })
        } catch (error) {
          console.log('error: ', error);
        }
      }
    } else {
      try {
        this.getState = options.getState ?
          options.getState
          : ((key: string, storage: Storage) => {
            const value = storage.getItem(key)
            if (typeStr(value) === 'String') {
              try {
                return this.jsonParse.parse(value || '{}')
              } catch (err) {
                throw new Error(err)
              }
            } else {
              return value || {}
            }
          })
  
          this.install = (store: Store<State>) => {
            const initState = this.initStorage ? this.getState(this.key, this.storage) : {};
            const reState = this.overwrite ? initState : merge(store.state, initState || {}, this.deepMergeOptions);
            // store.replaceState(reState as State);
            (this.initAfterFunction)(store);
            this.subscribe(store)((mutation: MutationPayload, state: State) => {
              if (this.filter(mutation)) {
                this.setState(this.key, this.reducer(state), this.storage)
              }
            })
          }
        
      } catch (error) {
        console.log('error: ', error);
      }
    }
    /**
     * replace is not modules key
     * @type {((state: S) => {}) | ((state: S) => S) | ((state: any) => {})}
     */
    this.reducer = options.reducer || (
      (options.modules == null)
        ? (state: State) => state
        : (state: any) => (options!.modules as string[]).reduce((a, i) => merge(a, { [i]: state[i] }, this.deepMergeOptions), {/* start empty accumulator*/ })
    )
  }
}
export {
  DefaultStorage, AsyncStorage, Options
}

export default VuexRefeshStorage