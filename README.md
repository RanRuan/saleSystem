### 运行环境
1. `node 6.9.5`
2. `npm 3.10.10`

### 启动项目
1. 首先全局安装webpack `npm install webpack@2.2.1 -g`
2. 升级npm至3.10.10, 然后`npm install`
3. 启动 `npm run start`

### 部署项目
1. 构建 `npm run build`

### 技术栈
1. 视图——react
2. 状态管理——mobx
3. 三方组件库——antd mobile 
4. 语法——es2015
5. 打包工具——webpack
9. 函数库——lodash

### 文件结构
```
| assets
  |-- style 样式
  |-- img 图片 icon
| components
  |-- common 通用组件
  |-- finance 财务管理组件
  |-- list 列表组件
| config
  |-- api基础路径配置
| entries
  |-- 全局样式配置
| pages
  |-- 页面
| store
  |-- auth 权限配置
  |-- finance 财务方法和数据管理
  |-- list 列表数据和方法管理
  |-- rebates 点位配置数据和方法
| util
  |-- dataSource 封装网络请求部分
  |-- auth 获取token
| varification
  |-- 校验方法
| APP 路由
| index 入口文件ß
  
```
