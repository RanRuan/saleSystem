import React, { Component } from 'react';
import PopWrap from '../components/common/popWrap';
import Top from '../components/common/top';
import Item from '../components/list/item';
// import AZ from '../components/list/a-z';
import ShowAgent from "../components/list/showAgent";
import Details from '../components/list/listDetails';
import QRCode from '../components/list/QRCode';

import store from '../store/list';
import { observer } from 'mobx-react';
import { toJS, action, runInAction } from 'mobx';
import DS from '../util/dataSource';
import { Toast } from 'antd-mobile';
import authStore from '../store/auth';
import _ from 'lodash';

@observer
class ListZiDai extends Component {
    state = {
        roleId: 3,
        showIndex: -1
    }
    componentDidMount() {
        if (authStore.authType === 0) {
            window.addEventListener('scroll', this.scroll);
        }       
        if (_.isNil(authStore.authType)) {
            authStore.fetchAuth(this.mount, this.props.match.params.id);
        } else {
            this.mount();
        }
 
    }
    mount = () => {
        // console.log(authStore.userId, this.state.roleId);
        
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

    showList = () => {
        if (store.sendLoading || !store.listDatas) {
            return null;
        } else {
            let clone = toJS(store.listDatas);
            return clone.map(item => {
                return <Item key={item.id} data={item} showIndex={this.state.showIndex} show={this.showIndex}/>
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
                <Top title="普代列表" id={this.props.match.params.id}/>
                {/* <SearchBar placeholder="Search" maxLength={8} /> */}
                <ul className="list" onClick={() => this.showIndex}>
                    {this.showList()}
                </ul>
                {/* <AZ /> */}
                {store.isPopingType === "FORBID" && store.isPoping && <PopWrap data={store.popData} />}                
                {store.isPopingType === "DETAIL" && store.isPoping && <Details data={store.popData} />}                
                {store.isPopingType === "FENZHI" && store.isPoping && <ShowAgent data={store.popData} id={this.props.match.params.id}/>}
                {store.isPopingType === "DROP" && store.isPoping && <PopWrap data={store.popData} />}
                {store.isPopingType === "QR" && store.isPoping && <QRCode data={store.popData} />}
                {(authStore.authType === 2 || authStore.authType === 3) && <p className="addIcon QR" onClick={() => store.isShowPoping({ type: "QR" })}><span><i className="iconfont icon-erweima"></i></span></p>}               
                {/* {store.roleId > 1 && authStore.authType !==0 && <p className="addIcon" onClick={() => store.isShowPoping({ type: "QR" })}><span><i className="iconfont icon-erweima"></i></span></p>} */}
                
            </div>
        )
    }
 
    loadingToast(duration) {
        Toast.loading('Loading...', duration, () => {
            console.log("加载完成", 'Loading....');
        });
    }
       successToast(tips) {
        Toast.success(tips, 1);
    }
}
export default ListZiDai;
