# vuex-refesh-storage

本项目是一个[Vuex](https://vuex.vuejs.org/) plugin，用于自动把store中的数据永久存储，例如localStorage、Cookies、localForage。

**注意**

1. 关于`localForage`只是初步这么实现，如果有好的意见可以讨论。
2. 本项目支持`TypeScript`

**package status**
[![GitHub stars](https://img.shields.io/github/stars/blackdous/vuex-refesh-storage.svg?style=social&label=%20vuex-refesh-storage)](http://github.com/blackdous/vuex-refesh-storage)
[![npm](https://img.shields.io/npm/v/vuex-refesh-storage.svg?colorB=dd1100)](http://npmjs.com/vuex-refesh-storage)
[![npm](https://img.shields.io/npm/dw/vuex-refesh-storage.svg?colorB=fc4f4f)](http://npmjs.com/vuex-refesh-storage)
[![license](https://img.shields.io/github/license/blackdous/vuex-refesh-storage.svg)]()

**package:size**
[![npm:size:gzip](https://img.shields.io/bundlephobia/minzip/vuex-refesh-storage.svg?label=npm:size:gzip)](https://bundlephobia.com/result?p=vuex-refesh-storage)
[![umd:min:gzip](https://img.badgesize.io/https://unpkg.com/vuex-refesh-storage?compression=gzip&label=umd:min:gzip)](https://unpkg.com/vuex-refesh-storage)
[![umd:min:brotli](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/vuex-refesh-storage?compression=brotli&label=umd:min:brotli)](https://cdn.jsdelivr.net/npm/vuex-refesh-storage)

## Install

```bash
  npm install vuex-refesh-storage -S
  # or yarn
  yarn add vuex-refesh-storage
```

使用 [UMD](https://github.com/umdjs/umd)、[unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/vuex-refesh-storage@0.1.0/dist/umd/index.min.js"></script>  
```

会在全局暴露一个`window.VuexRefeshStorage`对象。

> `storage`默认会使用`window.storage`

## 用法

**vuex-refesh-storage (for Vuex# and Vue2)**

**use JavaScript**

```js
  import Vuex from "vuex";
  import VuexRefeshStorage from 'vue-refesh-storage';
  const vuexRefeshStorage = new VuexRefeshStorage()
  // vue 2
  const store = new Vuex.Store({
    plugins: [vuexRefeshStorage.install]
  })
```

**use TypeScript**

```js
  import Vuex from "vuex";
  import VuexRefeshStorage from 'vue-refesh-storage';
  const vuexRefeshStorage = new VuexPersistence<RootState>({
    storage: window.localStorage
  })
  // vue 2
  const store = new Vuex.Store<State>({
    plugins: [vuexRefeshStorage.install]
  })
```

## API

初始化参数`new VuexRefeshStorage([options])`。

通过`new`实例化一个`VuexRefeshStorage`可以传入一下`options`定制一些功能。

| Property | Type | Descript |
| -------- | ---- | ---------------------------- |
| key | string | 存储持久状态的密钥。默认为vuex。 |
| modules | string[] | 您要保留的模块列表。（如果要使用此功能，请不要编写自己的reducer） |
| storage | Storage(web API) | `localStorage`, `sessionStorage`, `localforage` 或者 自定义 `Storage object`. <br>一定要包含 setItem、getItem、clear <br> _**Default: window.localStorage**_  |
| jsonParse | JSON:{ stringify, parse } | `JSON.stringify`不能处理循环引用、`null`、`funtion`等等，可以传入自定义的`JSON`对象。 |
| initStorage | Boolean | 初始化插件时，是否从`storage`存储中获取相同`key`对象；`default: true` 默认获取。 |
| overwrite | Boolean | 初始化插件时，从`storage`存储中获取相同`key`对象；和当前`store.state`中的值覆盖或者合并。默认`overwrite: true`为合并，`false`覆盖。 |
| deepMergeOptions | Object | 插件内部使用`deepmerge`库，当前插件中所有使用`deepmerge`合并方法可以统一使用`deepMergeOptions`来配置；默认为`{}`；不了解配置可以看[deepmerge options](https://github.com/TehShrike/deepmerge) |
| asyncMode | Boolean | `async:true`必须要结合`localForage`或者其他`storage: Promise`来使用 |
| filter | function (mutation) => boolean | `store.replaceState`时候根据`mutation.type`来过滤是否触发`setState`当前值存入`storage`中。默认不过滤任何`mutation`。 |
| reducer | function(state) => object | 在`setState`的时候会根据`modules`获取要保存的值。默认不过滤任何值。 |
| getState | function(key[, storage]) => state | 初始化插件事使用，用于获取`storage`中的存储。`initStorage`为`true`时使用。 |
| setState | function<br> (key, state[, storage]) | 存储持久状态的密钥。存储的key为`vuex` |
| initAfterFunction | function (store) => {} | 插件初始化时在`store.replaceState`更新完成`store.state`时会调用当前方法。|

## 使用示例

### 简单使用

使用`localstorage`来做为永久存储的`storage`，如果不传入`options.storage`时，就会默认使用`window.localStorage`。

```js
import { Store } from 'vuex';
import VuexRefeshStorage from 'vuex-refesh-storage';
const vuexRefeshStorage = new VuexRefeshStorage({});
const store = new Store({
  plugin: [vuexRefeshStorage.install]
})
```

事实上即使是自定义`storage`对象，只要存在`storage.setItem`、`storage.getItem`、`storeage.removeItem`就可以。

**使用sessionStorage**

```js
import { Store } from 'vuex';
import VuexRefeshStorage from 'vuex-refesh-storage';
const vuexRefeshStorage = new VuexRefeshStorage({
  storage: sessionStorage
});
const store = new Store({
  plugin: [vuexRefeshStorage.install]
})
```

**使用flatted**

如果在`state`中设置了`Circular`可以通过传入`options.jsonParse`来使用定制的转换方法，以`flatted`为例。

```js
import { Store } from 'vuex';
import flatted from 'flatted';
import VuexRefeshStorage from 'vuex-refesh-storage';
const vuexRefeshStorage = new VuexRefeshStorage({
  jsonParse: flatted
});
const store = new Store({
  plugin: [vuexRefeshStorage.install]
})
```

### 结合vuex中的modules

结合`store`中的`modules`使用，这是一个比较实用的样例。

在`vue-cli`中结合`modules`使用。
[![Edit boring-architecture-huksu](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/boring-architecture-huksu?fontsize=14&hidenavigation=1&theme=dark)

### nuxt.js中使用

在`nuxt`中结合`modules`使用。

**store/common/index.js**

```js
  import VuexRefeshStorage from 'vuex-refesh-storage'
  export const vuexCommonState = new VuexRefeshStorage({
    key: 'common',
    storage: window.sessionStorage
  })
  export const state = () => ({
    name: 'common'
    nubOnlinecountDown: 0,
    nubOnlineTime: 60,
    currentNow: new Date().getTime()
  })
  export const mutations = {
    setNubOnlinecountDown (state, newValue) {
      state.nubOnlinecountDown = newValue
    }
  }
```

**store/index.js**

```js
  import { vuexCommonState } from './common'
  export const plugins = [vuexCommonState.install]
```

`nuxt`中可以自动读取`store`文件下的`modules`模块并且生成可用的`vuex`代码。

## 结合localForage使用

因为`WebSQL`和`IndexedDB`都是异步操作，它们也可以存入对象、typeArray、ArrayBuffer等等类型。以`localForage`为例：

`window.localStorage`为例，传入的`storage`的对象为以下类型(**TypeScript**)：

```js
// 传入的同步storage类型

interface Storage {
  readonly length: number
  clear(): void
  getItem(key: string): string | null
  key(index: number): string | null
  removeItem(key: string): void
  setItem(key: string, data: string): void
  [key: string]: any
  [index: number]: string
}
```

如果使用类似于`localForage`的类型(**TypeScript**):

```js
  // 传入异步storage类型
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
```

如`localForage`中的`setItem/getItem`都可以是异步的操作，在插件初始化的时候并不能保证`getItem`获取的时机是准确的，所以这里提供了`initAfterFunction`参数，即使`getItem`是异步的也可以保证这个方法会在`getItem`执行完成之后才运行。

如果在使用`localForage`中的`setItem`、`getItem`方法做一些异步定制操作，可以通过重写`options.setState/options.getState`方法。

