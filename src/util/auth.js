import Cookies from 'js-cookie';
// import {browserHistory} from 'react-router';
const auth = {
  authenticated() {
    let token = Cookies.get('W_token');
    if(token) {
      return true;
    }
    return false;
  },
  getToken() {
    return Cookies.get('W_token');
  },
  logout() {
    Cookies.remove('W_token');
    Cookies.remove('W_roleId');
    localStorage.clear();
    // browserHistory.replace('/auth/login');
  },
  removeToken() {
    Cookies.remove('W_token');
  },
  saveAuthInfo(res) {
    // 七天过期
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const {token} = res;
    Cookies.set('W_token', token, {expires: expires});
    // Cookies.set('W_roleId', role.id, {expires: expires});
    // localStorage.setItem('qn-permission', JSON.stringify(permissions.map(o => o.code)));
  },
  getRoleId() {
    return Cookies.get('W_roleId');
  },
  can(permissions, source) {
    return permissions[source];
  }
};

export default auth;
