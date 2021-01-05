module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 防止babel将任何模块类型都转译成CommonJS类型，导致tree-shaking失效问题
        modules: false,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      /**
       * babel 在编译每一个模块的时候在需要的时候会插入一些辅助函数例如 _extend ，每一个需要的模块都会生成这个辅助函数，显而易见这会增加代码的冗余。
       * @babel/plugin-transform-runtime 这个插件会将所有的辅助函数都从 @babel/runtime-corejs3 导入（我们下面使用 corejs3），从而减少冗余性。
       */
      {
        corejs: {
          version: 3,
          proposals: true,
        },
        useESModules: true,
      },
    ],
  ],
}
