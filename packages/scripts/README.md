# zxs-script

## 介绍

对 webpack 打包配置进行封装，目前整合了 2 个命令：

- `zxs-script build`：该命令为打包
- `zxs-start develop`：该命令为开发环境运行

### 自定义配置

只是开放了基本的配置，在项目的根目录添加文件：`zxs.config.js`，可修改如下配置

```json
{
  "entry": "./src/index.tsx", // 入口，只支持单入口
  "output": "./dist", // 出口
  "template": "./public/index.html", // html模板
  "public": "./public", // 文件
  "tsConfigJson": "./tsconfig.json",
  "alias": {}
}
```
