import React, { Component } from 'react';
import Banner from '../components/common/banner';
import HomeList from '../components/common/homeList';
import authStore from '../store/auth';
import store from '../store/list';
import { observer } from 'mobx-react';
import _ from 'lodash';

@observer
class Home  extends Component {
    constructor(props) {
        super(props);
        this.id = _.get(props, 'match.params.id');
        
    }
    componentDidMount() {        
        authStore.fetchAuth(null, this.id);
    }
    render(){
        console.log(authStore.authType, authStore.authInfo)
        return (
            <div className="home">
                <Banner user={authStore.authInfo}/>
                <HomeList/>
            </div>
        )
    }
}

export default Home;
