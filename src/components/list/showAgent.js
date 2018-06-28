import React, { Component } from 'react';
import '../../asserts/style/popWrap.css';
import store from '../../store/list';
import { observable, action, runInAction, toJS } from 'mobx';
import { ActivityIndicator } from 'antd-mobile';
import { observer } from 'mobx-react';
import DS from '../../util/dataSource';
import authStore from '../../store/auth';
import _ from 'lodash';
import classNames from 'classnames';

@observer
class ShowAgent extends Component {
    @observable agents;
    async componentDidMount() {
        try {
            const res = await DS.query(`users/${_.get(store, 'popData.id')}/superiors`);
            runInAction(() => {
                this.agents = res.source.superiors;
            });

        } catch (error) {
            console.error(error, 'fcontentmount');
        }
    }
    renderClass = roleId => {
        return classNames({
            zongDai: roleId === 1,
            fenDai: roleId === 2,
            puDai: roleId === 3
        })
    }
    render() {
        let agents = this.agents;
        if(authStore.auth) {
            const currentUser = _.findIndex(agents, {id: authStore.auth.id});
            if (currentUser !== -1) {
                agents = agents.slice(currentUser);
            }
        }
        return (
            <div className="pop">
                <div className="popWrap">
                    <p className="del" onClick={() => store.isClosePoping()}>×</p >
                    <h3 className="pop-title">查看分支</h3>
                    <ul className="agents-wrap" style={{ margin: '20px 0' }}>
                        {
                            _.map(agents, (o, i) =>
                                <li key={i}>
                                   {o.roleId < 3 && <p className={this.renderClass(o.roleId)}>{o.agentName}</p >}
                                   {o.roleId === 3 && <p className={this.renderClass(o.roleId)}>{o.phoneNum}</p >}
                                   
                                    {/* {
                                        i !== agents.length - 1 && <span></span>
                                    } */}
                                    <span></span>
                                </li>
                            )
                        }
                        <li>
                            <p className='puDai'>{_.get(store, 'popData.phoneNum')}</p >
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default ShowAgent;