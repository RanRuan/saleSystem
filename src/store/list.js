import { observable, action, runInAction, toJS  } from 'mobx';
import DS from '../util/dataSource';
import _ from 'lodash';
import authStore from "./auth";

class ListStore {

// 用户列表数据
    @observable listDatas;
// 总代列表
    @observable zongDaiList;
// 角色
    @observable roleData;
    @observable page = {};
// 运营查看用户列表类型 | 总代，分代，普代 |
    @observable roleId;
// 弹出窗数据 | 解禁，封禁，删除，详情，二维码 |
    @observable popData;  
// 弹出窗
    @observable isPoping = false;
// 弹出窗类型
    @observable isPopingType;   
//数据请求发出
    @observable sendLoading = false;
// 增加 删除 编辑 封禁 解禁
    @observable setSuccess = false;

    // 选中ID
    @observable chooseId;

// 运营权限下获取列表数据
    @action fetchDatas = async (roleId, nextPage) => {
        this.sendLoading = true;                
        // let  withParent;
        // if (this.roleId === 2) {
        //     withParent = true
        // }else {
        //     withParent = ""
        // }
        this.roleId = roleId;
        // console.log(withParent + "widthParent");
        
        try {
            const query = {
                roleId: this.roleId,
                page: nextPage || 1,
                perPageNum: 10,
                withParent:true
            }
            for (const key in query) {
                if (query[key] === "") {
                    delete query[key]
                }
            }
            const res = await DS.query(`users/list`, query);
            runInAction(() => {
                this.listDatas = res.data;
                this.page = res.source.pagination;
                
            })
        } catch (error) {
            console.error(error + "fetchData");
            this.sendLoading = false;
        }
        this.sendLoading = false;                
    }

// 获取所有总代
    @action fetchZongDaiList = async () => {
        try {
            const query = {
                roleId:1
            }
            const res = await DS.query(`users/list`,query);
            runInAction (()=>{
                this.zongDaiList = res.data;                
            })
        } catch (error) {
            console.error(error + "fetchZongDai");            
        }
    }

// 除运营权限下获取列表数据  
    @action fetchUserData = async (userId, roleId,isDownList=false) => {
        this.sendLoading = true;
        try {
            const res = await DS.query(`users/${userId}/children`, {isFlat: true});
            runInAction(() => {
                this.roleData = res.source;
                this.roleId = roleId;
                this.listDatas = _.filter(res.source.children, o => o.roleId === roleId);
                this.page = res.source.pagination;
                // 普代权限的下级只显示下两级数据
                if (isDownList) {
                     let nowCodeLength = this.roleData.code.length;
                     console.log(nowCodeLength);
                    this.listDatas = _.filter(res.source.children, o => {
                        return o.code.length <= nowCodeLength + 8;
                    });
                }
            })
        } catch (error) {
            console.error(error, 'fetchUserData');
            this.sendLoading = false;            
        }
        this.sendLoading = false;
    }

    @action addData = async (agentName, name, phoneNum, note, parentId="") => {   
        this.setSuccess = true;
        if (parseInt(parentId)) {
            parentId = parseInt(parentId);
        }
        let data = { parentId, agentName, name, phoneNum, note};
        for(const key in data){
            if(data[key]===""){
                delete data[key]
            }
        }
        try {
            const res = await DS.create(`users?roleId=${this.roleId}`, data);
            runInAction(() => {
                if (authStore.authType === 0) {
                    this.fetchDatas(this.roleId);
                } else {
                    this.fetchUserData(authStore.userId, this.roleId);
                }
            })
        } catch (error) {
            console.error(error + "addData")
            this.setSuccess = false;
        }
        this.setSuccess = false;
    }

    @action editData = async (ID, agentName, name, phoneNum, note,parentId="") => {
        this.setSuccess = true;
        if (parseInt(parentId[0])) {
            parentId = parseInt(parentId);
        } 
        let data = { agentName, parentId, name, phoneNum, note };
        for (const key in data) {
            if (data[key] === "") {
                delete data[key]
            }
        }
        try {
            const res = await DS.update(`users/${ID}/profile`, data);
            runInAction(() => {
                this.listDatas = this.listDatas.map(item => {
                    if (item.id === ID) {
                        item.agentName = agentName || agentName;
                        item.name = name || item.name;
                        item.phoneNum = phoneNum || item.phoneNum ;
                        item.note= note || item.note;
                    }
                    return item;
                })
                if (authStore.authType === 0) {
                    this.fetchDatas(this.roleId);
                } else {
                    this.fetchUserData(authStore.userId, this.roleId);
                }           
            })
        } catch (error) {
            console.error(error + "EditData")
            this.setSuccess = false;
        }
        this.setSuccess = false;
    }

    @action delData = async (ID) => {
        this.setSuccess = true;
        try {
            await DS.destroy(`users/${ID}`);
            runInAction(() => {
                let index = this.listDatas.findIndex(record => {
                    return record.id === ID;
                })
                this.listDatas.splice(index, 1);
                if (authStore.authType === 0) {
                    this.fetchDatas(this.roleId);
                } else {
                    this.fetchUserData(authStore.userId, this.roleId);
                }   
            })
            } catch (error) {
            this.setSuccess = false; 
            console.error(error + "delData") 
        }
        this.setSuccess = false; 
    }

    @action changeStatus = async (ID,status)=> {
        this.setSuccess = true;
        try {
            // const res = await axios.put(path + '/users/' + ID + '/status', { disabled: !status})
            //                         .then(res => res)
            const res = await DS.update(`users/${ID}/status`, {disabled: status});

            runInAction(()=>{     
                this.listDatas = this.listDatas.map(item=>{
                    if (item.id === ID) {
                        item.disabled = status;
                    }
                    return item;
                })
                if (authStore.authType === 0) {
                    this.fetchDatas(this.roleId);
                } else {
                    this.fetchUserData(authStore.userId, this.roleId);
                }                
            })
        } catch (error) {
            this.setSuccess = false;
            console.error(error + "changeStatus")
        }
        this.setSuccess = false;
    }
    @action isShowPoping = (type,ID, data)=>{
        this.isPoping = true;
        this.isPopingType = ""; 
        this.choose = data;
        // const element = document.getElementsByTagName('body')[0];
        // element.style.position = 'fixed';
        // element.style.width = '100%';
        // element.style.height = '100%';

        let clone = toJS(this.listDatas);
        this.popData = clone.find((item) => item.id === ID)
        switch (type.type) {
            case "ADD":
                this.isPopingType = "ADD"; 
                break;
            case "EDIT":
                this.isPopingType = "EDIT"; 
                break;
            case "FORBID":
                this.isPopingType = "FORBID"; 
                break;
            case "DROP":
                this.isPopingType = "DROP";
                break;
            case "DEL":
                this.isPopingType = "DEL";
                break;
            case "RESET":
                this.isPopingType = "RESET";
                break;
            case "DETAIL":
                this.isPopingType = "DETAIL";
                break;
            case "QR":
                this.isPopingType = "QR";
                break;
            case "FENZHI":
                this.isPopingType = "FENZHI";
                break;
            default:
                this.isPopingType = ""; 
                break;
        }
    }

    @action isClosePoping = () => {
        this.isPoping = false;
        const element = document.getElementsByTagName('body')[0];
        // element.style.overflow = 'auto';
    }
}
export default new ListStore();