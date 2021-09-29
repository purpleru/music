# 说明

- 网易云一键打卡是一个能够快速帮助您的网易云音乐账号升级的程序。
- 项目前端技术点:
  - `jQuery`
  - `Bootstrap`
  - `js-cookie`
  - `art-template`
- 项目后端技术点
  - `express`
- 项目更新说明
  - 2021/9/24
    - 废弃之前的所有Api接口，采用全新Api架构。
    - 支持PHP环境部署，把 `public` 文件夹里面的文件放在PHP服务器即可。
    - 去除后端 `axios` `set-cookie-parser` `cheerio` 等第三方依赖包。

## 开始使用

- 拉取本项目 => 下载依赖包 `npm install` => 启动项目 `npm run start` 或者 `node server.js`
- 演示地址：[http://demo.wgudu.com](http://demo.wgudu.com:3006)