# vuex-localForage

本项目是一个[Vuex](https://vuex.vuejs.org/) plugin，用于自动把store中的数据永久存储，例如localStorage、Cookies、localForage。

**package status**
[![GitHub stars](https://img.shields.io/github/stars/championswimmer/vuex-persist.svg?style=social&label=%20vuex-refesh-storage)](http://github.com/blackdous/vuex-refesh-storage)
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
| storage | Storage(web API) | localStorage, sessionStorage, localforage 或者 自定义 Storage object. <br>一定要包含 setItem、getItem、clear <br> _**Default: window.localStorage**_  |
| setState | function<br> (key, state[, storage]) | 存储持久状态的密钥。默认为vuex。 |