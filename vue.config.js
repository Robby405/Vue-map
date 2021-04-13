module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
    },
  },
  chainWebpack: (config) => {
    //packages和examples目录需要加入编译
    config.module
      .rule("js")
      .include.add(/packages/)
      .end()
      .use('babel')
      .loader('babel-loader').tap(options => {
          //修改他的选项
          return options;
      });
  },
};
