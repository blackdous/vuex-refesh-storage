export interface AsyncStorage {
  _config?: {
    name: string
  }
  getItem<T>(key: string, callback?: (err: any, value: T | null) => void): Promise<T | null>;
  setItem<T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T>;
  removeItem(key: string, callback?: (err: any) => void): Promise<void>;
  clear(callback?: (err: any) => void): Promise<void>;
  length(callback?: (err: any, numberOfKeys: number) => void): Promise<number>;
  key(keyIndex: number, callback?: (err: any, key: string) => void): Promise<string>;
  keys(callback?: (err: any, keys: string[]) => void): Promise<string[]>;
}