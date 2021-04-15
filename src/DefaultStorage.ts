/*
 * @Descripttion: 
 * @Author: 19080088
 * @Date: 2021-04-15 16:27:51
 * @LastEditors: 19080088
 * @LastEditTime: 2021-04-15 18:02:29
 */
interface DefaultStorage {
  getItem: (key: String) => any,
  setItem: (key: String, value: String) => any,
  removeItem: (key: string) => void,
  clear: ()
}
