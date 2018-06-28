import React, { Component } from 'react';
import { Toast} from 'antd-mobile';

import PopWrap from '../components/common/popWrap';
import Top from '../components/common/top';
import Item from '../components/list/item';
import Details from '../components/list/listDetails';
import QRCode from '../components/list/QRCode';

import DS from '../util/dataSource';
import store from '../store/list';
import authStore from '../store/auth';

import { toJS,action,runInAction, observable } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';

@observer
class ListFenDai extends Component {
    state = {
       roleId: 2,
       showIndex:-1
    }
    componentDidMount() {
        if (authStore.authType===0) {
            window.addEventListener('scroll', this.scroll);
        }
        if (_.isNil(authStore.authType)) {
            authStore.fetchAuth(this.mount, this.props.match.params.id);
        } else {
            this.mount();
        }
    }
    mount = () => {
        if (authStore.authType === 0) {
            store.fetchDatas(this.state.roleId);
        } else {
            store.fetchUserData(authStore.userId, this.state.roleId);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll);
    }

    scroll = () => {
        if (document.documentElement.scrollTop +
            document.body.scrollTop +
            window.innerHeight === document.body.scrollHeight + 60) {
            this.loadMore();
        }
    }
    
    @action
    loadMore = async () => {
        const { page, perPageNum = 10, total } = store.page;
        if ((page * perPageNum) >= total) {
            return;
        }
        let nextPage = (page || 0) + 1;
        const query = {
            roleId: this.state.roleId,
            page: nextPage || 1,
            perPageNum: 10,
            withParent: true            
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

    showList = () => {
        if (store.sendLoading || !store.listDatas) {
            return null;
        } else {
            let clone = toJS(store.listDatas);
            return clone.map(item => {
                return <Item key={item.id} data={item} id={this.props.match.params.id} show={this.showIndex} showIndex={this.state.showIndex}/>
            })
        }
    }
    showIndex = (index) => {
        this.setState({
            showIndex: index
        }) 
    }
    render() {
        if (store.setSuccess) {
            store.isPopingType === 'ADD' && this.successToast('添加成功');
            store.isPopingType === 'EDIT' && this.successToast('编辑成功');
            store.isPopingType === 'DEL' && this.successToast('删除成功');
            store.isPopingType === 'FORBID' && this.successToast('已封禁');
            store.isPopingType === 'DROP' && this.successToast('已解除');
        }
        if (store.sendLoading) {
            this.loadingToast(10, { mask: true })
        } else {
            Toast.hide()
        }
        return (
            <div >
                <Top title="分代列表" id={this.props.match.params.id}/>
                {/* <SearchBar placeholder="Search" maxLength={8} /> */}
                <ul className="list" onClick= {() => this.showIndex}>
                    {this.showList()}
                </ul>
                {store.isPopingType === "ADD" && store.isPoping && <PopWrap />}
                {store.isPopingType === "EDIT" && store.isPoping &&<PopWrap data={store.popData} />}
                {store.isPopingType === "DEL" && store.isPoping &&<PopWrap data={store.popData} />}
                {store.isPopingType === "FORBID" && store.isPoping &&<PopWrap data={store.popData} />}
                {store.isPopingType === "DROP" && store.isPoping &&<PopWrap data={store.popData} />}
                {store.isPopingType === "DETAIL" && store.isPoping && <Details data={store.popData} />}
                {store.isPopingType === "QR" && store.isPoping && <QRCode data={store.popData} />}
                {authStore.authType === 0 && <p className="addIcon" onClick={() => store.isShowPoping({ type: "ADD" })}><span><i className="iconfont icon-jiahaocu"></i></span></p>}
                {/* {authStore.authType === 2 && <p className="addIcon" onClick={() => store.isShowPoping({ type: "QR" })}><span><i className="iconfont icon-erweima"></i></span></p>} */}
                {/* {(authStore.authType === 2 || authStore.authType === 3)&& <p className="addIcon" onClick={() => store.isShowPoping({ type: "QR" })}><span><i className="iconfont icon-erweima"></i></span></p>} */}
            </div>
        )
    }
   
    successToast(tips) {
        Toast.success(tips, 1);
    }
    loadingToast(duration) {
        Toast.loading('Loading...', duration, () => {
            console.log("加载完成", 'Loading....');
        });
    }

}

export default ListFenDai;
