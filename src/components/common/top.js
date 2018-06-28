import React, { Component } from 'react';
import '../../asserts/style/top.css';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

@observer
class Top extends Component {
    
    render(){
        return (
            <div className="top">
                <Link to={`/${this.props.id}`}><i className="iconfont icon-caidan"></i></Link>
                <span>{this.props.title}</span>
            </div>
        )
    }
}
export default Top;