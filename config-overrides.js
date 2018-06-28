const { injectBabelPlugin } = require('react-app-rewired');
const rewireMobX = require('react-app-rewire-mobx');
module.exports = function override(config, env) {
    // do stuff with the webpack config..// `style: true` 会加载 less 文件
    config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: 'css' }], config);
    config = rewireMobX(config, env);
    return config;
};
//修改默认配置。


