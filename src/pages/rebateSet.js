import React, { Component } from 'react';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Toast } from 'antd-mobile';

import _ from "lodash";
import Top from "../components/common/top";
import "../asserts/style/rebates.css";
import moment from 'moment';
import store from '../store/rebates';

@observer
class Rebates  extends Component {
    constructor(props) {
        super(props);
        console.log(props, 'id');
        this.id = _.get(props, 'params.id');
    }
    @observable updateData = {
        headRate: null,
        subRate: null,
        childRate1: null,
        childRate2: null
    };

    state = {
        isShowPop: false,
        isUpdate : false,
        input: {
            msg: "",
            isPass:false
        },
        roleId0:{
            value:""
        },
        roleId1: {
            value: ""
        },
        roleId2: {
            value: ""
        },
        roleId3: {
            value: ""
        }
    }
  
    async componentDidMount(){
        store.fetchNow(this.changeUpdate);
        store.fetchHistory();
    }

    renderPop() {
        this.setState({
            isShowPop: true
        });

        const element = document.getElementsByTagName('body')[0];
        element.style.position = 'fixed';
        element.style.width = '100%';
        element.style.height = '100%';
    }

    renderClosePop() {
        this.setState({
            isShowPop: false
        });
        const element = document.getElementsByTagName('body')[0];
        element.style.overflow = 'auto';
    }

    @action
    updateRebates = e => {
        this.updateData[e.target.id] = e.target.value;
    }
    @action changeUpdate = data => {
        this.updateData = data;
    }


    onSubmit = () => {
        const data = [
            {
                roleId: 1,
                rate: this.updateData.headRate / 100
            },
            {
                roleId: 2,
                rate: this.updateData.subRate / 100
            },
            {
                roleId: 3,
                rate: this.updateData.childRate1 / 100,
                rate2: this.updateData.childRate2 / 100
            }
        ]
        store.updateRate(data, this.changeUpdate);
        if (store.updated) {
            this.successToast("更新成功")
            this.setState({
                isShowPop: false                
            })
        }
        this.renderClosePop()
    }
   
    render(){
        return (
            <div className="rebates List-wrap"> 
                <Top title="点位配置" id={this.props.match.params.id}/>
                <div className="rebate-content content">
                    <ul className="rebates-list">
                        <li>
                            <h3 className="update-time">当前点位</h3>
                            <p className="update-data">
                                <span>总代点位: {_.get(store.nowRate, 'headRate')}%</span>
                                <span>分代点位: {_.get(store.nowRate, 'subRate')}%</span>
                                <span>一级点位: {_.get(store.nowRate, 'childRate1')}%</span>
                                <span>二级点位: {_.get(store.nowRate, 'childRate2')}%</span>
                            </p>
                        </li>
                        <li>
                            <h3 className="update-time">历史点位</h3>
                              {
                                  store.historyRate && 
                                  _.map(_.reverse(toJS(store.historyRate)), o => (
                                    <div className="update-data" key={o.createdAt}>
                                        <div style={{width: '100%'}}>{moment(o.createdAt).format('YYYY-MM-DD HH:mm:ss')} 更新</div>

                                        <span>总代点位: {o.headRate ? `${_.round(o.headRate * 100, 2)}%` : '-'}</span>
                                        <span>分代点位: {o.subRate ? `${_.round(o.subRate * 100, 2)}%` : '-'}</span>
                                        <span>一级点位: {o.childRate1 ? `${_.round(o.childRate1 * 100, 2)}%` : '-'}</span>
                                        <span>二级点位: {o.childRate2 ? `${_.round(o.childRate2 * 100, 2)}%` : '-'}</span>
                                    </div>
                                  ))
                              }
                        </li>
                    </ul>        
                </div>
                {this.state.isShowPop && <div className="pop">
                    <div className="popWrap" >
                        <p className="del"  onClick={()=>this.renderClosePop()}>×</p>
                        <h3 className="pop-title">更新点位</h3>
                        <div className="post-from">
                            <form>
                                <ul className="form-list">
                                    <li>
                                        <label htmlFor="firstName">总代点位:</label>
                                        <input type="text" id="headRate" value={this.updateData.headRate}
                                                            onChange={(e) =>this.updateRebates(e)}
                                        />%
                                    </li>
                                    <li>
                                        <label htmlFor="agentName">分代点位:</label>

                                        <input type="text" id="subRate" value={this.updateData.subRate}
                                                            onChange={(e) =>this.updateRebates(e)}
                                        />%
                                    </li>
                                    <li>
                                        <label htmlFor="agentTel">一级点位:</label>
                                        <input type="text" id="childRate1" value={this.updateData.childRate1}
                                                                onChange={(e) =>this.updateRebates(e)}
                                        />%
                                    </li>
                                    <li>
                                        <label htmlFor="agentTel">二级点位:</label>
                                        <input type="text" id="childRate2" value={this.updateData.childRate2}
                                                                onChange={(e)=>this.updateRebates(e)}
                                                                ref={(second) => this.second = second} 
                                        />%
                                        <p>{this.state.input.msg}</p>
                                    </li>
                                </ul>
                               
                            </form>
                        </div> 
                        <p className="btn-wrap" onClick={this.onSubmit}>确定</p>
                    </div>
                </div >}
                <p className="addIcon" onClick={() => this.renderPop()}><span><i className="iconfont icon-jiahaocu"></i></span></p>
            </div>
        )
    }
    successToast(tips) {
        Toast.success(tips, 1);
    }
}
export default Rebates;