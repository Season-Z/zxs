#!/usr/bin/env node

"use strict";

const chalk = require("chalk");
const program = require("commander");

const pkg = require("../package.json");
const { commandMap, commandKeys } = require("./commandMap");
const files = require("../lib");

// 生成命令
commandKeys.forEach((name) => {
  const { command, alias, description, validate } = commandMap[name];
  program
    .command(command)
    .alias(alias)
    .description(description)
    .action(async (...args) => {
      // 如果存在校验函数
      if (validate && typeof validate === "function") {
        await validate(...args);
      }
      files(name, ...args);
    });
});

// 添加 --help 输出的内容
program.on("--help", () => {
  console.log("Examples: ");
  commandKeys.forEach((coms) => {
    const { examples } = commandMap[coms];
    const examplesMsg = examples.join("\n").trim();
    console.log("  " + examplesMsg);
  });
});

program.arguments("<command>").action((cmd) => {
  console.log(` ${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
  program.outputHelp();
});

program.version(pkg.version, "-v, --version").usage("<command> [options]");

program.parse(process.argv); // 解析变量

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

function onError(err) {
  console.error(err.message);
  process.exit(1);
}

process.on("uncaughtException", onError);
process.on("unhandledRejection", onError);
