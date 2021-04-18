/*
 * @Descripttion: 
 * @Author: 19080088
 * @Date: 2021-04-14 13:58:00
 * @LastEditors: 19080088
 * @LastEditTime: 2021-04-18 22:23:26
 */
import { Mutation, MutationPayload, Payload, Plugin, Store } from 'vuex'
import { AsyncStorage } from './AsyncStorage'
import DefaultStorage from './DefaultStorage'
import { Options } from './Options'

const typeStr = function (value:any) {
  const len = value.length
  return Object.prototype.toString.call(value).substring(8, len -1)
}

export class VuexRefeshStorage<S> implements Options<S> {

  public constructor(options?: Options<S>) {
    if (typeStr(options) === 'Undefined') {
      options = {} as Options<S>
    }

    const storage = options.storage || (window && window.localStorage);
  }
}