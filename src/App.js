import React, { Component } from 'react';
import Home from './pages/home';
import ListZongDai from './pages/list.zongdai';
import ListFenDai from './pages/list.fendai';
import ListZiDai from './pages/list.zidai';
import ListZiDaiChildren from './pages/list.zidaichildren';
import FinanceM from './pages/finance.m';
import Rebates from './pages/rebateSet';
import { Route } from 'react-router-dom';
class App extends Component {
  render() {
    return (
      <div className="App">
          <Route exact path ="/:id" component={Home}/>
          <Route path="/:id/list/zongdai" component={ListZongDai}/>
          <Route path="/:id/list/fendai" component={ListFenDai} />
          <Route exact path="/:id/list/zidai" component={ListZiDai} />
          <Route path="/:id/list/zidai/children" component={ListZiDaiChildren} />
          <Route path="/:id/finance/m" component={FinanceM} />
          <Route path="/:id/rebates" component={Rebates} />
     </div>
    );
  }
}
export default App;
