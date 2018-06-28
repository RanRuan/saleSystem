import React, { Component } from 'react';
import '../../asserts/style/popWrap.css';
import { Picker, List,Toast, Button} from 'antd-mobile';
import { createForm } from 'rc-form';
import store from '../../store/list';
import authStore from '../../store/auth';
import _ from 'lodash';
import { isPhoneNumber} from '../../verification/index.js';
import { observer } from 'mobx-react';
import { runInAction, observable, action, toJS } from 'mobx';
@observer
class Pop extends Component {
    @observable selectValue = [];
    state= {
        parentId: {
            msg: null,
            isPass: false
        },
        agentName:{
            msg: null,
            isPass: false
        },
        name:{
            msg: null,
            isPass: false 
             
        },
        phoneNum: {
            msg: null,
            isPass: false
            
        },
        note:{
            msg:null,
            isPass:false           
        },
        postStatus:{
            msg:"请按格式填写",
            isPass:false
        },
        parent: [],
        asyncValue:null,              
        inputagentName: this.props.data && this.props.data.agentName ? this.props.data.agentName : "",
        inputname: this.props.data && this.props.data.name ? this.props.data.name:"",
        inputphoneNum: this.props.data && this.props.data.phoneNum ? this.props.data.phoneNum:"",
        inputnote: this.props.data && this.props.data.note ? this.props.data.note:""
    }
    componentDidMount(){
       this.fetchParent()
    }
//验证手机号码
    isVerify (e){
        if (this.refs.phoneNum.value.trim() === "") {
            this.setState({
                phoneNum: {
                    msg: null,
                    isPass:true
                }
            })
        }else if (this.refs.phoneNum.value !== "" && isPhoneNumber(this.refs.phoneNum.value)){
            this.setState({
                phoneNum:{
                    msg:null,
                    isPass:true
                }
            })
        }else{
            this.setState({
                phoneNum: {
                    msg: "该手机号码无效",
                    isPass:false
                }
            })
            e.target.value="";
        }
    }

// 验证必填项代理名称
    isRequired(){
        let val = this.refs.agentName.value;
        var reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,40}$/
        if (val && val.trim()=== "") {
           this.setState({
                agentName: {
                    msg: "名称不能为空"
                }
           })
        } else if (val && val.trim().length > 40){
            this.setState({
                agentName: {
                    msg: "长度超限了(<40)",
                    isPass: false
                }
            })
        } else if (!reg.test(val)) {
            this.setState({
                agentName: {
                    msg: "名称请用中文数字字母"
                }
        })   
        } else if(reg.test(val)) {
            this.setState({
                agentName: {
                    msg: null,
                    isPass: true
                }
            })   
        }
    }
// 验证姓名
    isNotRequired() {
        this.setState({
            name: {
                msg: null,
                isPass: false
            }
        }) 
        let val = this.refs.name.value;
        var reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{0,40}$/
        if (val && val.trim().length > 40) {
            this.setState({
                name: {
                    msg: "长度超限了(<40)"
                }
            })
        } else if (!reg.test(val)) {
            this.setState({
                name: {
                    msg: "名称只能是数字字母中文"
                }
            })
        } else if (reg.test(val)&&val.trim()) {
            this.setState({
                name: {
                    msg:null,
                    isPass:true
                }
            })
        }
    }

//验证备注
    isNotRequiredNote() {
        this.setState({
            note: {
                msg: null,
                isPass: false
            }
        })
        let val = this.refs.name && this.refs.name.value;
        var reg = /^[0-9a-zA-Z\u4e00-\u9fa5_]{0,200}$/
        if (val && val.trim().length > 200) {
            this.setState({
                note: {
                    msg: "长度超限了(<200)"
                }
            })
        } else if (!reg.test(val)) {
            this.setState({
                note: {
                    msg: "内容只能是数字字母中文"
                }
            })
        } else if (reg.test(val) && val &&val.trim()) {
            this.setState({
                note: {
                    msg: null,
                    isPass: true
                }
            })
        }
    }
//添加代理
    addAgent = ()=> {
        console.log('tianjia')
        if(!this.refs.agentName.value){
            this.setState({
                agentName:{
                    msg:'请填写代理名称'
                }
            })
            return;
        }
        if (this.state.agentName.msg || this.state.name.msg || this.state.phoneNum.msg || this.state.note.msg) {
            return;
        } else {
            let agentName = this.refs.agentName && this.refs.agentName.value;
            let name = this.refs.name && this.refs.name.value;
            let phoneNum = this.refs.phoneNum && this.refs.phoneNum.value;
            let note = this.refs.note && this.refs.note.value;
            let parentId = this.state.asyncValue && this.state.asyncValue[0];
            if (store.roleId===2) {
                if (authStore.authType===1) {
                    console.log(store.roleData.id);
                    parentId = store.roleData && store.roleData.id;
                }
                store.addData(agentName, name, phoneNum, note, parentId)
            }else{
                store.addData(agentName, name, phoneNum, note) 
            }
            if (store.setSuccess) {
                // this.successToast("添加成功")
                store.isClosePoping()
            }
        }
    }
//编辑代理
    editData = () => {
        if (this.state.parentId.msg || this.state.agentName.msg || this.state.name.msg || this.state.phoneNum.msg || this.state.note.msg) {
            return;
        } else {
            let agentName = this.refs.agentName && this.refs.agentName.value;
            let name = this.refs.name && this.refs.name.value;
            let phoneNum = this.refs.phoneNum && this.refs.phoneNum.value;
            let note = this.refs.note && this.refs.note.value;
            let parentId = this.state.asyncValue && this.state.asyncValue[0];
            if (store.roleId===2) {
                if (authStore.authType === 1) {
                    console.log(store.roleData.id);
                    parentId = store.roleData && store.roleData.id;
                }
                store.editData(this.props.data.id, agentName, name, phoneNum, note, parentId)
            }else {
                store.editData(this.props.data.id, agentName, name, phoneNum, note)
            }
            if (store.setSuccess) {
                // this.successToast("更新成功")
                store.isClosePoping()
            }
        }
    }

// 删除代理
    delData = () => {
        console.log(1)
        store.delData(this.props.data.id)
        if (store.setSuccess) {
            // this.successToast("删除成功")
            store.isClosePoping()
        }
    }
// 改变用户状态
    changeStatus = (status) => {
        store.changeStatus(this.props.data.id,status)      
        if (store.setSuccess&&status) {
            // this.successToast("已封禁")
            store.isClosePoping()
        } else if (store.setSuccess && !status){
            // this.successToast("已解禁")
            store.isClosePoping()
        }
    }
// 编辑功能
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = event.target.id;
        this.setState({
            ["input"+ name]: value
        });
    }

 // 获取总代列表
    @action
    fetchParent = async () => {
        
        try {
            await store.fetchZongDaiList();
            runInAction(() => {
                let parentData = [];
                store.zongDaiList.map(item => {
                    parentData.push({ value: String(item.id), 
                                      label: `${item.id}-${item.agentName}`, 
                                    //   children: 
                                    //         [{ label: String(item.agentName), 
                                    //            value: String(item.id) 
                                    //     }] 
                    })
                })
                let defaultValue = parentData[0]
                this.setState({
                    parent: parentData,
                    asyncValue:[defaultValue&&defaultValue.value]
                    // asyncValue: [defaultValue.value, defaultValue.value]         
                }) 
                this.selectValue.replace([defaultValue.value]);
            })
        } catch (error) {
            console.log(error + 'fetchParent');
        }
    }

// 选择总代ID
    parentId = v => {
        this.setState({
            parentId: {
                msg: null,
                isPass: true
            }
        })
        this.selectValue = v;
        this.setState({
            asyncValue: v
        })
    }
// 选择总代id列表
    renderParentId(){
        if (store.roleId===2) {
            return(
                <Picker
                    extra={this.state.asyncValue}
                    data={this.state.parent}
                    cols={1}
                    value={toJS(this.selectValue)}
                    onChange={this.parentId}
                >
                    <List.Item arrow="horizontal"> 所属总代ID:{this.state.asyncValue&&this.state.asyncValue[0]}</List.Item>
                </Picker>
            )
        }
    }
    render(){
       return(
           <div className="pop">
               <div className="popWrap" >
                   <p className="del" onClick={() => store.isClosePoping(false)}><i className="iconfont icon-guanbi"></i></p>
                   {store.isPopingType === "ADD" ? <h3 className="pop-title">添加代理</h3> : ""}
                   {store.isPopingType === "EDIT" ? <h3 className="pop-title">编辑代理</h3> : ""}
                   {store.isPopingType === "DROP" ? <h3 className="pop-title">确定解禁?</h3> : ""}
                   {store.isPopingType === "FORBID" ? <h3 className="pop-title">确定封禁?</h3> : ""}
                   {store.isPopingType === "DEL" ? <h3 className="pop-title">确认删除?</h3> : ""}
    {/* 全局添加 */}
                   {store.isPopingType === "ADD" ? 
                   <div className="post-from">
                       <form>
                           <ul className="form-list">
                               {
                                   authStore.authType===0 && store.roleId === 2 &&
                                   <li className="parentId">
                                        {this.renderParentId()}
                                   </li>
                               }
                               <li>
                                {/* <p>{this.state.parentId.isPass? "" : this.state.parentId.msg}</p>         */}
                                   <label htmlFor="firstName">代理名称:</label>
                                   <input type="text" id="firstName" ref="agentName" onBlur={(e) => this.isRequired(e)} />
                                   <span style={{ color: "red" }}>*</span>
                                   <p>{this.state.agentName.isPass ? "" : this.state.agentName.msg}</p>
                               </li>
                              {store.roleId===1 && <li>
                                   <label htmlFor="agentName">姓名:</label>
                                   <input type="text" id="agentName" ref="name" onBlur={(e) => this.isNotRequired(e)} />
                                   <p>{this.state.name.isPass ? "" : this.state.name.msg}</p>
                               </li>}
                                {store.roleId === 1 &&  <li>
                                   <label htmlFor="agentTel">手机号码:</label>
                                   <input type="text" id="agentTel" ref="phoneNum" onBlur={(e) => this.isVerify(e)} />
                                   <p>{this.state.phoneNum.isPass ? "" : this.state.phoneNum.msg}</p>
                               </li>}
                               <li>
                                   <label htmlFor="post-comment">备注:</label>
                                   <textarea id="post-comment" ref="note" onBlur={(e) => this.isNotRequiredNote(e)}></textarea>
                                   <p>{this.state.note.isPass ? "" : this.state.note.msg}</p>
                               </li>
                           </ul>
                       </form>
                   </div> : ""}
    {/* 编辑 */}
                   {store.isPopingType === "EDIT" ? <div className="post-from">
                       <form>
                           <ul className="form-list">
                               {
                                   authStore.authType===0 && store.roleId === 2 &&
                                   <li>
                                       <label>所属总代ID:</label>
                                       <input type="text" id="parentId" disabled value={this.state.asyncValue && this.state.asyncValue[0]}/>
                                   </li>
                               }
                               <li>
                                   <label htmlFor="agentName">代理名称:</label>
                                   <input type="text" id="agentName" ref="agentName"
                                       value={this.state.inputagentName}
                                       onChange={(e) => this.handleInputChange(e)}
                                       onBlur={(e) => this.isRequired(e)} />
                                   <span style={{ color: "red" }}>*</span>
                                   <p>{this.state.agentName.isPass ? "" : this.state.agentName.msg}</p>
                               </li>
                               {store.roleId === 1 &&  <li>
                                   <label htmlFor="name">姓名:</label>
                                   <input type="text" id="name" ref="name"
                                       value={this.state.inputname}
                                       onChange={(e) => this.handleInputChange(e)}
                                       onBlur={(e) => this.isNotRequired(e)} />

                                   <p>{this.state.name.isPass ? "" : this.state.name.msg}</p>
                               </li>}
                               {store.roleId === 1 && <li>
                                   <label htmlFor="phoneNum">手机号码:</label>
                                   <input type="text" ref="phoneNum" id="phoneNum"
                                       value={this.state.inputphoneNum}
                                       onChange={(e) => this.handleInputChange(e)}
                                       onBlur={(e) => this.isVerify(e)} />
                                   <p>{this.state.phoneNum.isPass ? "" : this.state.phoneNum.msg}</p>
                               </li>}
                               <li>
                                   <label htmlFor="note">备注:</label>
                                   <textarea ref="note" id="note"
                                       value={this.state.inputnote}
                                       onChange={(e) => this.handleInputChange(e)}
                                       onBlur={(e) => this.isNotRequiredNote(e)}></textarea>
                                   <p>{this.state.note.isPass ? "" : this.state.note.msg}</p>
                               </li>
                           </ul>
                       </form>
                   </div> : ""}
                   {store.isPopingType === 'ADD' && <p  className="btn-wrap" onClick={ _.debounce(this.addAgent,200)}>添加</p>}
                   {store.isPopingType === 'EDIT' && <p  className="btn-wrap" onClick={() => this.editData()}>更新</p>}
                   {store.isPopingType === 'DEL' && <p  className="btn-wrap" onClick={() => this.delData()}>删除</p>}
                   {store.isPopingType === 'FORBID' && <p  className="btn-wrap" onClick={() => this.changeStatus(true)}>封禁</p>}
                   {store.isPopingType === 'DROP' && <p  className="btn-wrap" onClick={() => this.changeStatus(false)}>解封</p>}
               </div >
           </div>
       )
    }
}

let PopWrap = createForm()(Pop);
export default PopWrap ;