/*
 * @Descripttion: 
 * @Author: 19080088
 * @Date: 2021-04-18 21:26:16
 * @LastEditors: 19080088
 * @LastEditTime: 2021-04-19 16:16:26
 */
import { Store, MutationPayload } from 'vuex'
import { AsyncStorage } from './AsyncStorage'
import DefaultStorage from './DefaultStorage'
import deepmerge from 'deepmerge'
export interface Options<State> {
  /**
   * Key to use to save the state into the storage
  */
  key?: string
  /**
   * store module
   */
  modules?: string[]
  /**
   * Window.Storage type object. Default is localStorage
  */
  storage?: Storage | DefaultStorage | AsyncStorage
  /**
   * default window.JSON or flatted
   */
  jsonParse? : object
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
  setState?: (key: string, state: any, storage: Storage) => Promise<void> | void
  /**
   * method to get state
   */
  getState?: (key: string, storage: Storage) => Promise<void> | void
  /**
   * filter state.replace
   */
  filter?: (mutation: MutationPayload) => boolean

  reducer?: (state: State, modules: string[]) => object

  subscribe?: (
    store: Store<State>
  ) => (handler: (mutation: any, state: State) => void) => void
}