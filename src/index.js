// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './asserts/imgs/icons/iconfont.css';
import './entries/flexible';
import './entries/flexible.css';

//pc事件转手机端事件
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
ReactDOM.render(
<BrowserRouter>
<App/>
</BrowserRouter>, 
document.getElementById('root'));
registerServiceWorker();
