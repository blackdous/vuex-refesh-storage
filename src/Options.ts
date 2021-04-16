import { Payload } from 'vuex'
import { AsyncStorage } from './AsyncStorage'
export interface Options<State> {
  /**
   * Key to use to save the state into the storage
  */
  key?: string
  /**
   * Window.Storage type object. Default is localStorage
  */
  storage?: Storage | AsyncStorage
  /**
   * method to set state
   * @param key
   * @param state
   * @param storage
   */
  setState?: (key: string, state: any, storage: Storage) => Promise<void> | void
  /**
   * method to get state
   */
  getState?: (key: string, storage: Storage) => any

}