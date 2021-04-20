/*
 * @Descripttion: 
 * @Author: 19080088
 * @Date: 2021-04-20 21:49:25
 * @LastEditors: 19080088
 * @LastEditTime: 2021-04-20 23:28:24
 */
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import configs from './config'

const externals = [
  'deepmerge',
  'vuex'
]

const genTsPlugin = (configOpts) => typescript({
  useTsconfigDeclarationDir: true,
  tsconfigOverride: {
    ccompilerOptions: {
      target: configOpts.target,
      declaration: configOpts.genDts
    }
  }
})

const genPlugins = (configOpts) => {
  const plugins = []
  if (configOpts.env) {
    plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(configOpts.env)
    }))
  }
  plugins.push(replace({
    'procee.env.MODULE_FORMAT': JSON.stringify(configOpts.format)
  }))
  if (configOpts.plugins && configOpts.plugins.pre) {
    plugins.push(...configOpts.plugins.pre)
  }
  plugins.push(genTsPlugin(configOpts))

  if (configOpts.plugins && configOpts.plugins.post) {
    plugins.push(...configOpts.plugins.post)
  }

  return plugins
}

const genConfig = (configOpts) => ({
  input: 'src/index.ts',
  output: {
    file: configOpts.output,
    format: configOpts.format,
    name: 'VuexRefeshStorage',
    sourcemap: true,
    exports: 'named',
    globals: configOpts.globals
  },
  external: externals,
  plugins: genPlugins(configOpts)
})

const genAllConfigs = (configs) => (Object.keys(configs).map(key => genConfig(configs[key])))

export default genAllConfigs(configs)