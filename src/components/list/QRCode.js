import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { observable, action, runInAction, toJS  } from 'mobx';
import '../../asserts/style/details.css';
import store from '../../store/list';
import authStore from '../../store/auth';
import DS from '../../util/dataSource';
import _ from 'lodash';

@observer
class QRCode  extends Component {
    @observable inviteCode;

    @action async componentDidMount() {

        let choose = authStore.authType > 1 ? authStore.auth : store.choose;
        let content = {};
        let sub = false;
        if (authStore.authType > 1) {
            // 分代 子代
            sub = true;
            content = {
                roleId: 3,
                parentId: choose.id
            }
        } else {
            content = {
                roleId: choose.roleId,
                parentId: choose.parentId,
                userId: choose.id
            };
            if (choose.roleId === 1) {
                delete content.parentId
            } else if (choose.roleId === 3) {
                content.parentId = content.userId;
                delete content.userId;
            }
        }
        const res = await DS.create(`users/${choose.id}/inviteCode`,{sub:sub,content});
        runInAction(() => {
            this.inviteCode = _.get(res, 'source.code');
        });
      try {
      } catch (error) {
          console.error(error, 'qrcodecomponentDidMount');
          
      }  
    }
    render(){
        return (
            <div className="pop">
                <div className="details Fun" style={{height: '30%'}}>
                    <p className="qrcode-title">查看邀请码</p>
                    <p className="del" onClick={store.isClosePoping}>×</p>  
                    <p style={{textAlign: 'center', marginTop: 30, fontSize: '1rem'}}>{this.inviteCode}</p>
                </div>
             </div>
        )
    }
}

export default QRCode;