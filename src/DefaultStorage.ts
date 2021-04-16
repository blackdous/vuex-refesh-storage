/*
 * @Descripttion: 
 * @Author: 19080088
 * @Date: 2021-04-15 16:27:51
 * @LastEditors: 19080088
 * @LastEditTime: 2021-04-16 08:38:58
 */
interface DefaultStorage {
  getItem: (key: string) => any,
  setItem: (key: string, value: string) => any,
  removeItem: (key: string) => any,
  clear: (key: string) => any,
  key: (index: number) => any
}

export default DefaultStorage