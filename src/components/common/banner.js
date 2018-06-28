import React, { Component } from 'react';
import '../../asserts/style/banner.css';

export default class Banner  extends Component {
    render(){
        console.log(this.props.user);
        let name = this.props.user && this.props.user.phoneNum;
        if(!name){
            name =  this.props.user && this.props.user.name;
        }
        return (
            <div className="banner">
            {name?name:""} 您好
            </div>
        )
    }
}