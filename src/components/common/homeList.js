import React, { Component } from 'react';
import '../../asserts/style/homeList.css';
import authStore from '../../store/auth';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

@observer
class HomeList  extends Component {
    render(){
        return (
            <ul className="mainList">
                {
                    authStore.authType === 0 &&
                    <li><Link to={`/${authStore.appUserId}/list/zongdai`}><span><i className="iconfont icon-ren111"></i>总代列表</span></Link></li>
                }
                {
                    authStore.authType < 2 &&
                    <li><Link to={`/${authStore.appUserId}/list/fendai`}><span><i className="iconfont icon-yonghu1"></i>分代列表</span></Link></li>
                }
                {
                    authStore.authType < 3 &&
                    <li><Link to={`/${authStore.appUserId}/list/zidai`}><span><i className="iconfont icon-yonghu"></i>普代列表</span></Link></li>
                }
                {
                    authStore.authType === 3 &&
                    <li><Link to={`/${authStore.appUserId}/list/zidai/children`}><span><i className="iconfont icon-ren111"></i>下级列表</span></Link></li>
                }
                {   authStore.authType < 4 && 
                    <li><Link to={`/${authStore.appUserId}/finance/m`}><span><i className="iconfont icon-renminbi"></i>财务管理</span></Link></li>
                }
                {
                    authStore.authType === 0 &&
                    <li><Link to={`/${authStore.appUserId}/rebates`}><span><i className="iconfont icon-shezhi"></i>点位配置</span></Link></li>
                }
            </ul>
        )
    }
}

export default HomeList;
