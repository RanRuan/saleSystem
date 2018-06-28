import React, { Component } from 'react';
import Top from '../components/common/top';
import FContent from '../components/finance';
import authStore from '../store/auth';

 class FinanceM extends Component {
    
    render(){
        return (
            <FContent id={this.props.match.params.id}/>
        )
    }
}
export default FinanceM;
