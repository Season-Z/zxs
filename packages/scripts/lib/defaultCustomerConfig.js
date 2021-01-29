// 默认配置
const defaultCustomerConfig = {
  entry: "./src/index.tsx",
  output: "./dist",
  template: "./public/index.html",
  public: "./public",
  tsConfigJson: "./tsconfig.json",
  alias: {},
};

// 不做校验的文件
const excludeValidateKeyArr = ["output", "tsConfigJson"];

// 映射
const ALIAS = "alias";

module.exports = {
  defaultCustomerConfig,
  excludeValidateKeyArr,
  ALIAS,
};
