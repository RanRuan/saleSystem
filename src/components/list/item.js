import React, { Component } from 'react';
import store from '../../store/list';
import authStore from '../../store/auth';
import '../../asserts/style/list.css';
import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export default class Item extends Component {
 
    showSet = (id)=>{    
        this.props.show(id)
    }
    showSetClose = (id) => {
        this.props.show(-1)
    }
    showDetail=(type)=>{
        store.isShowPoping(type,this.props.data.id)
    }
    showQR = (type) => {
        store.isShowPoping(type, this.props.data.id, this.props.data)
    }
    showAgent = (type) => {
        store.isShowPoping(type, this.props.data.id)
    }

    showSetList=()=>{        
            return (<ul className="listSet">
            {/* 运营权限 */}
                {this.props.data.disabled && authStore.authType === 0 && <li onClick={() => store.isShowPoping({ type: 'DROP' }, this.props.data.id)}><i className="iconfont icon-jiesuounlocked25" style={{ color: "#D0021B" }} ></i>解禁</li>}
                {!this.props.data.disabled && authStore.authType === 0 && <li onClick={() => store.isShowPoping({ type: 'FORBID'}, this.props.data.id)}><i className="iconfont icon-jinzhiforbidden1" style={{ color: "#D0021B" }}></i>封禁</li>}
            {/* 运营权限 非普代*/}
                {authStore.authType === 0 && store.roleId !== 3 &&<li onClick={() => store.isShowPoping({type:'EDIT'},this.props.data.id)}><i className="iconfont icon-bianji3" style={{ color: "#5CB000" }}></i>编辑</li>}
                {authStore.authType === 0 && store.roleId !== 3 && <li onClick={() => store.isShowPoping({ type: "DEL" }, this.props.data.id)}><i className="iconfont icon-delete" style={{ color: "#D0021B" }}></i>删除</li>}
                
                <li onClick={() => this.showDetail({ type: "DETAIL" })}> <i className="iconfont icon-miaoshucopy" style={{ color: "#4A90E2" }}></i>详情</li>
            {store.roleId !== 3 && <li onClick={() => this.showQR({ type: "QR" })}><i className="iconfont icon-erweima" style={{ color: "#FF9800" }}></i>邀请码</li>}
            {/* 普代专属 */}
                {store.roleId===3 &&< li onClick={() => this.showAgent({ type: "FENZHI" })}><i className="iconfont icon-84" style={{ color: "#FF9800" }}></i>查看分支</li>}
            </ul>)
        
    }
    renderStatus(data){
        if (data.disabled) {
            return <span className="list-agent-status" style={{ color: "#F44336" }}>封禁</span>
        }else {
            if (data.status===0&&store.roleId!==3) {
                return <span className="list-agent-status" style={{ color: "#FFC107" }}>未注册</span>
            }else {
                return <span className="list-agent-status" style={{ color: "#8BC34A" }}>正常</span>
            }
        }
    }
    render(){
        let setClassName = classNames({
            'isPressed': this.props.showIndex === this.props.data.id
        })   
        console.log(this.props.data);
        
        return (
            <li>
                {/* <p className="index-title">A</p> */}
                <div className="list-agent-info">
                    <p className="list-agent-name">
                        {store.roleId < 3 ? <span>{this.props.data.agentName}</span>:<span>{this.props.data.phoneNum}</span>}
                        {store.roleId === 1 && <span>姓名：{this.props.data.name}</span>} 
                        {store.roleId === 2 && authStore.authType === 0 && <span>所属总代:{this.props.data.Parent && this.props.data.Parent.agentName}</span>}      
                        {store.roleId === 2 && authStore.authType === 1 && <span>APP用户名:{this.props.data && this.props.data.appName}</span>}                                               
                          
                        <span>ID:{this.props.data.id}</span>
                        <span>appId:{this.props.data.appUserId}</span>
                        {this.renderStatus(this.props.data)}
                        {/* 此次有状态,颜色会不一样 */}
                    </p>
                    <p className="list-tel"><i className="iconfont icon-shouji"></i>{this.props.data.phoneNum}</p>
                    <p className="comment-more">
                        <span className="list-comment">{this.props.data.note}</span>
                        <span className="more">
                            {this.props.showIndex === this.props.data.id && <span onClick={() => this.showSetClose(this.props.data.id)}> <i className="iconfont icon-guanbi"></i></span>}
                            {this.props.showIndex === this.props.data.id || <i className="iconfont icon-tubiaozhizuomoban" onClick={() => this.showSet(this.props.data.id)}></i>}</span>
                    </p>
                </div>
                {this.props.showIndex === this.props.data.id && this.showSetList()}
                <p className={setClassName}></p>
            </li>
        )
    }
}