import React, { Component } from 'react';
import '../asserts/style/404.css';

class Error extends Component {
    render() {
        return (
               <div>
                    <div className='error'>
                        <h2>404</h2>
                        <h3>啊哦！出错了...</h3>
                        <p><i className="iconfont icon-404"></i></p>
                   </div>
             </div>
        )
    }
}
export default Error;