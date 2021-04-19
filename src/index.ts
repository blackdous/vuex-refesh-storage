/*
 * @Descripttion: 
 * @Author: 19080088
 * @Date: 2021-04-19 08:51:29
 * @LastEditors: 19080088
 * @LastEditTime: 2021-04-19 17:11:55
 */
import { Mutation, MutationPayload, Payload, Plugin, Store } from 'vuex';
import { AsyncStorage } from './AsyncStorage';
import DefaultStorage from './DefaultStorage';
import { Options } from './Options';
import merge from "deepmerge";

const typeStr = function (value:any) {
  const len = value.length;
  return Object.prototype.toString.call(value).substring(8, len -1);
}

export class VuexRefeshStorage<State> implements Options<State> {

  public key: string
  public modules: string[]
  public storage: Storage | AsyncStorage | DefaultStorage
  public async: boolean
  public jsonParse: object
  
  public getState: (key: string, storage: Storage) => Promise<void> | void
  public setState: (key: string, state: any, storage: Storage) => Promise<void> | void
  public reducer: (state: State) => Partial<State>
  public filter: (mutation: Payload) => boolean
  public subscribe: (store: Store<State>) => (handler: (mutation: any, state: State) => void) => void

  public constructor(options?: Options<State>) {
    // init options
    options = options || {};

    this.storage = options.storage || (window && window.localStorage);
    this.key = options.key || "normal";
    
    this.filter = options.filter || ((mutation) => true)

    const jsonParse = options.jsonParse || JSON

    this.async = options.async || false

    this.setState = (
      options.setState ? 
        options.setState : 
        (key: string, state: {}, storage: Storage | AsyncStorage) =>
        storage.setItem(key, jsonParse.stringify(state))
        
    )
  }
}