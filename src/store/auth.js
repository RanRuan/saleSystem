import { observable, action, runInAction } from 'mobx';
import auth from '../util/auth';
import axios from "axios";
import config from '../config';

class Auth {
  @observable authType;
  @observable appUserId;
  @observable userId;
  @observable authInfo;
  @action changType = type => {
    this.authType = type;
  }
  @action fetchAuth = async (cb, id) => {
    try {
      const data = {
        // appUserId: 18020600000002, // 0运营
        // appUserId: 18022700000003 // 1总代
        // appUserId: 18051900000051 // 2分代
        // appUserId: 18032500000012  // 3普代
        appUserId: id
      };
      const res = await axios({
                            method: 'post',
                            url: `${config.basePath}auth`,
                            data:data
                        })
                        .then(res => res.data)
      auth.saveAuthInfo(res);
      runInAction(() => {
        this.authType = res.user.roleId;
        this.auth = res.user;
        this.userId = res.user.id;
        this.authInfo = res.user;
        this.appUserId = res.user.appUserId;
        
      })
      if (cb) {
        cb();
      }
    } catch (error) {
      console.error(error, 'fetchAuth');
    }
  }
}
export default new Auth();
