import { action, runInAction, toJS  } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
//样式
import { Toast } from 'antd-mobile';
import Top from '../components/common/top';

import store from '../store/list';
import DS from '../util/dataSource';
import authStore from '../store/auth';

//功能组件
import PopWrap from '../components/common/popWrap';
import Item from '../components/list/item';
import Details from '../components/list/listDetails';
import QRCode from '../components/list/QRCode';
import _ from 'lodash';

@observer
class ListZongDai extends Component {
// roleId便于运营权限获取列表
    state = {
        roleId:1,
        showIndex: -1
    }
    componentDidMount() {
        window.addEventListener('scroll', this.scroll);
        if (_.isNil(authStore.authType)) {
            authStore.fetchAuth(this.mount, this.props.match.params.id);
        } else {
            this.mount();
        }
    }
    mount = () => {
        store.fetchDatas(this.state.roleId); 
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll);
    }
    scroll = () => {
        if (document.documentElement.scrollTop +
            window.innerHeight  === document.body.scrollHeight + 60) {
            this.loadMore();
        }
    }
    @action
    loadMore = async () => {
        const {page, perPageNum = 10, total} = store.page;
        if ((page * perPageNum) >= total ) {
            return;
        }
        let nextPage = (page || 0) + 1;
        const query = {
            roleId: this.state.roleId,
            page: nextPage || 1,
            perPageNum: 10
        }
        try {
            const res = await DS.query(`users/list`, query);
            runInAction(() => {
                const oldData = toJS(store.listDatas) || [];
                store.listDatas = oldData.concat(res.data);
                store.page = res.source.pagination;
            })
        } catch (error) {
            console.error(error, 'loadMore');
        }
    }
    showList= ()=> {
        if (store.sendLoading || !store.listDatas) {
            return null; 
        }else{
            return store.listDatas.map((item, i) =>{
                return <Item key={item.id} data={item} key={i} showIndex={this.state.showIndex} show={this.showIndex}/>
            })
        }
    }
    showIndex = (index) => {
        this.setState({
            showIndex: index
        })
    }
    render(){
        console.log(store.sendLoading, store.listDatas, authStore.authType);
        
         if (store.setSuccess) {
            store.isPopingType === 'ADD' && this.successToast('添加成功');
            store.isPopingType === 'EDIT' && this.successToast('编辑成功');
            store.isPopingType === 'DEL' && this.successToast('删除成功');
            store.isPopingType === 'FORBID' && this.successToast('已封禁');
            store.isPopingType === 'DROP' && this.successToast('已解除');
        }
      
        return (
            <div >
                <Top title="总代列表" id={this.props.match.params.id}/>
                {/* <SearchBar placeholder="Search" maxLength={8} /> */}
                <ul className="list" onClick={() => this.showIndex}>
                    {this.showList()}
                </ul>
                {/* <AZ/> */}
                {store.isPopingType === "ADD" && store.isPoping&& <PopWrap />}                
                {store.isPopingType === "EDIT" && store.isPoping && <PopWrap data={store.popData}/>}
                {store.isPopingType === "DEL" &&  store.isPoping && <PopWrap data={store.popData} />}
                {store.isPopingType === "FORBID" && store.isPoping && <PopWrap data={store.popData} />}
                {store.isPopingType === "DROP" && store.isPoping && <PopWrap data={store.popData} />}
                {store.isPopingType === "DETAIL" && store.isPoping && <Details data={store.popData}/>}
                {store.isPopingType === "QR" && store.isPoping && <QRCode data={store.popData} />}
                {authStore.authType === 0 && <p className="addIcon" onClick={()=> store.isShowPoping({ type: "ADD" })}><span><i className="iconfont icon-jiahaocu"></i></span></p>}
            </div>
        )
    }
    successToast(tips) {
        Toast.success(tips, 1);
    }
    loadingToast(duration) {
        Toast.loading('Loading...',duration);
    }
    componentDidUpdate() {
        if (store.sendLoading) {
            this.loadingToast(10, { mask: true })
        } else {
            Toast.hide()
        }
    }
}
export default ListZongDai;
