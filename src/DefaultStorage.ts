interface DefaultStorage {
  getItem: (key: string) => any,
  setItem: (key: string, value: string) => any,
  removeItem: (key: string) => any,
  clear?: (key: string) => any,
  key?: (index: number) => any
}

export default DefaultStorage