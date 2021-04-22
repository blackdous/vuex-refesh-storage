/*
 * @Descripttion: 
 * @Author: 19080088
 * @Date: 2021-04-19 08:51:29
 * @LastEditors: 19080088
 * @LastEditTime: 2021-04-22 17:15:49
 */
import { Store, MutationPayload } from 'vuex'
import { AsyncStorage } from './AsyncStorage'
import DefaultStorage from './DefaultStorage'

export interface Options<State> {
  /**
   * Key to use to save the state into the storage
  */
  key?: string
  /**
   * deepmerge use options
   */
  deepMergeOptions?: object
  /**
   * modules
   */
  modules?: string[]
  /**
   * state init getState()
   */
  initStorage?: boolean
  /**
   * init state overwirte or merge
   */
  overwrite?: boolean
  /**
   * Window.Storage type object. Default is localStorage
  */
  storage?: Storage | DefaultStorage | AsyncStorage
  /**
   * default window.JSON or flatted
   */
  jsonParse? : JSON
  /**
   * storage is AsyncStorage
   */
  async?: boolean
  /**
   * method to set state
   * @param key
   * @param state
   * @param storage
   */
  setState?: (key: string, state: any, storage: Storage | AsyncStorage | DefaultStorage) => Promise<void> | void
  /**
   * method to get state
   */
  getState?: (key: string, storage: Storage | AsyncStorage | DefaultStorage) => Promise<void> | void
  /**
   * filter state.replace
   */
  filter?: (mutation: MutationPayload) => boolean

  reducer?: (state: State) => {}
  /**
   * Method to retrieve state from persistence
   * @param {String} key
   * @param {Object} [storage]
   */
  restoreState?: (key: string, storage?: Storage) => Promise<State> | State
  /**
   * subscribe mutation to update state
   */
  subscribe?: (
    store: Store<State>
  ) => (handler: (mutation: any, state: State) => void) => void
}