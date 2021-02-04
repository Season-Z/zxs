"use strict";

const webpack = require("webpack");
const { productionConfig } = require("./complexConfig");

module.exports = () => {
  const config = productionConfig();
  const compiler = webpack(config);

  compiler.run((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log();
      console.log("😙 感谢使用 zxs-script ~");
      console.log();
    }
  });
};
