import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import PopWrap from '../components/common/popWrap';
import Top from '../components/common/top';
import Item from '../components/list/item';
// import AZ from '../components/list/a-z';
import ShowAgent from "../components/list/showAgent";
import Details from '../components/list/listDetails';
import QR from '../components/list/QRCode';
import authStore from '../store/auth';
import _ from 'lodash';
import store from '../store/list';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

@observer
class ListZiDaiChildren extends Component {
    state = {
        roleId: 3,
        showIndex: -1,
        downList:true
    }
    componentDidMount() {
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
            store.fetchUserData(authStore.userId, this.state.roleId,this.state.downList);
        }
    }

    showList = () => {
        console.log(this.state.showIndex);
        
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
        console.log(toJS(store.listDatas));
        
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
                <Top title="下级列表" id={this.props.match.params.id}/>
                {/* <SearchBar placeholder="Search" maxLength={8} /> */}
                <ul className="list" onClick={() => this.showIndex}>
                    {this.showList()}
                </ul>
                {/* <AZ /> */}
                {store.isPopingType === "FORBID" && store.isPoping && <PopWrap data={store.popData} />}
                {store.isPopingType === "DETAIL" && store.isPoping && <Details data={store.popData} />}
                {store.isPopingType === "FENZHI" && store.isPoping && <ShowAgent data={store.popData} />}
                {store.isPopingType === "DROP" && store.isPoping &&<PopWrap data={store.popData} />}
                {store.isPopingType === "QR" && store.isPoping && store.isPoping&& <QR data={store.popData} />}
                <p className="addIcon QR" onClick={() => store.isShowPoping({ type: "QR" })}><span><i className="iconfont icon-erweima"></i></span></p>
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
export default ListZiDaiChildren;
