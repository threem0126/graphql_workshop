
# 1.脚手架功能
了解本脚手架包含的功能，移步README2.md

# 2.环境筹备

## 安装graphql客户端工具 
```sh
npm install -g graphql-cli
```

## 安装prisma(graphql配套的ORM框架)命令行工具
```sh
npm i prisma -g
```

# 3.运行项目
```ja

# 安装依赖组件（你需要先安装yarn：$ npm i yarn -g）
$ yarn install 

# 创建mysql数据库（docker内）
$ cd database && docker-compose up -d 

# 部署Prisma服务（根据模型自动创建数据库、创建generated/prisma.graphql）
$ npm run deploy

# 启动graphql服务 (runs on http://localhost:4000) ，并打开Playground
$ yarn dev

```

# 4.运行单元测试

## 调用prisma-api层
```bash
$ jest src/test/on_prisma_graphql.test.js
```

## 调用graphql-api层
```bash
$ jest src/test/on_schema_graphql.test.js
```

