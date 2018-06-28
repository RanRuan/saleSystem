import React, { Component } from 'react';
import '../../asserts/style/details.css';
import '../../store/list';
import { observer } from 'mobx-react';
import axios from "axios";
import moment from 'moment';

import store from '../../store/list';
import util from "../../util";
import DS from '../../util/dataSource';
import authStore from '../../store/auth';
import config from '../../config';
import { locale } from 'moment';
import { observable, runInAction } from 'mobx';
@observer
export default class Details  extends Component {
    state={
        num:{}
    }
    @observable qrInfo;
    @observable userId;
    @observable userInfo;
  async componentDidMount(){
      this.userId = store.popData && store.popData.appUserId;
            DS.query(`users/${this.props.data.id}/children?isFlat=true`)
                .then(res => {
                    console.log(res);
                    this.setState({
                        num: util.getCounts(res.source)
                    })
                }) 
      const res = await DS.query(`users/${this.userId}/appInfo`);
       this.userInfo = res.source && res.source.result;
       console.log(this.userInfo);
       
      if (store.roleId <=2) {
        let QRId = store.popData && store.popData.id;
        const QRTime = await DS.create(`users/${QRId}/inviteCode`).then(res=>res.source);
        runInAction(()=>{
            console.log(QRTime.createdAt + '------- ');
              this.qrInfo = moment(QRTime.createdAt).format('YYYY-MM-DD HH:mm:ss')
              console.log(this.qrInfo);
        })
      }
    }
    renderLevel(){
        switch (this.props.data.roleId) {
           case 1:
               return "总代"
            case 2:
                return "分代"
            case 3:
                return "普代"
           default:
               break;
       }
    }
    renderStatus() {
        switch (this.props.data.status) {
            case 0:
                return "未注册"
            case 1:
                return "正常"
            case 2:
                return "封禁"
            default:
                break;
        }
    }

    render(){
       let data = this.props.data;
        return (
            <div className="pop">
            <div className="details Fun">
                <p className="del" onClick={()=>store.isClosePoping()}>×</p>                    
                    <div className="details-content">
                        {store.roleId < 3 && this.props.data.status === 0 && <p className="status" style={{color:"#FFC107"}}>{this.renderStatus()}</p>}
                        {store.roleId < 3 && this.props.data.status === 1 && <p className="status" style={{ color: "#8BC34A" }}>{this.renderStatus()}</p>}
                        {store.roleId ===3 && !this.props.data.disabled && <p className="status" style={{ color: "#8BC34A" }}>正常</p>}
                        
                    <div className="detail-info">
                        <ul className="details-top">
                            <li className="agent">
                               {store.roleId <3 ?<p>代理名：{data && data.agentName}</p>:<p>用户名：{data && data.phoneNum || this.userInfo && this.userInfo.phoneno}</p>}<span className="agentLevel">{this.renderLevel()}</span>
                            </li>
                            {store.roleId <3 &&data && data.name && <li className="agentName">用户名:{data && data.name}</li>}
                            <li className="comment">用户ID：{data && data.id}</li>
                            <li className="comment">appID：{data && data.appUserId}</li>
                            {/* {store.roleId !== 1 && <li className="agentName">APP用户名:{this.userInfo && this.userInfo.phoneno}</li>} */}
                            <li className="comment">备注：{data && data.note}</li>
                        </ul>
                        
                    {/* 总代列表统计显示 */}
                        {store.roleId===1?
                            <ul className="agent-data">
                                <li>
                                    <p className="hasRegNum">已注册分代</p>
                                    <span className="regNum">{this.state.num && this.state.num.firstNormalCounts && this.state.num.firstNormalCounts.length}</span>
                                </li>
                                <li>
                                    <p className="hasSubAgent">已生成分代</p>
                                    <span>{this.state.num && this.state.num.firstCounts}</span>
                                </li>
                                <li>
                                    <p className="hasAgents">下级总数</p>
                                    <span>{this.state.num && this.state.num.allCounts}</span>
                                </li>
                            </ul>
                            :<ul className="agent-data">
                                <li>
                                    <p className="hasRegNum">下一级代理</p>
                                    <span className="regNum">{this.state.num && this.state.num.firstCounts}</span>
                                </li>
                                <li>
                                    <p className="hasSubAgent">下二级代理</p> 
                                    <span>{this.state.num && this.state.num.secondCounts}</span>
                                </li>
                                <li>
                                    <p className="hasAgents">下级总数</p> 
                                    {/* 只要是普代列表3 只显示一二级相加 */}
                                    {store.roleId <= 2 && <span>{this.state.num && this.state.num.allCounts}</span>}
                                    {store.roleId > 2 && <span>{this.state.num && this.state.num.firstCounts + this.state.num.secondCounts}</span>}
                                </li>
                        </ul>}
                    {/* 总代列表信息显示 */}
                    {store.roleId===1?
                    <ul className="agent-tel-id">
                        <li>
                            <p className="tel-icon"><i className="iconfont icon-shouji"></i>手机号码</p>
                            <p className="telNum">{data && data.phoneNum}</p>
                        </li>
                    </ul>:
                    <ul className="agent-tel-id">
                        <li>
                            <p className="tel-icon"><i className="iconfont icon-shouji"></i>手机号码</p>
                            <p className="telNum">{this.userInfo && this.userInfo.phoneno||data && data.phoneNum}</p>
                        </li>
                        <li>
                            <p className="third-agent-name"><i className="iconfont icon-ren111"></i>APP姓名:</p>
                            <p className="telNum">{this.userInfo && this.userInfo.phoneno}</p>
                        </li>
                       
                      {store.roleId < 3 && authStore.authType === 0 &&
                            <li>
                                <p><i className="iconfont icon-ren111"></i>所属总代</p>
                                <p className="telNum">{data.Parent && data.Parent.agentName}</p>
                            </li>
                        }
                        {/* <li>
                            <p className="id-icon"><i className="iconfont icon-cardid"></i>身份证</p>
                            <p className="telNum">{this.userInfo && this.userInfo.idcard}</p>
                        </li> */}
                    </ul>
                    }
                    <ul className="agent-qrcode-app">
                        <li>
                            {store.roleId <= 2 && <p className="codeCreateTime">邀请码创建时间<span>{this.qrInfo}</span></p>}
                            <p className="appRegTime">App注册时间<span>{this.userInfo&&moment(this.userInfo.regist_time).format('YYYY-MM-DD HH:mm:ss')}</span></p>
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}