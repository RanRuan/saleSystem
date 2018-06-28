import { observable, action, runInAction, toJS} from 'mobx';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import '../../asserts/style/finance.css';
import {
    DatePicker,
    Button,
    Modal,
    PickerView,
    List,
    Toast
} from 'antd-mobile';
import classNames from 'classnames';
import moment from 'moment';
import DS from '../../util/dataSource';
import _ from 'lodash';
import authStore from '../../store/auth';
import Top from '../common/top';
const prompt = Modal.prompt;
const operation = Modal.operation;

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const initTime = new Date().toLocaleDateString();
let initStamp = '';


const CustomChildren = ({ extra, onClick, children }) => (
    <div className="date-range" onClick={onClick}>
        <i className="iconfont icon-rili"></i>
        <span className="start-end">{children}  --   {extra}</span>
    </div>
);

@observer
class FContent extends Component {
    // 弹框显示
    @observable visible = false;
    // 弹框类型
    @observable modalType = 'role1';
    // 弹框选中
    @observable activeOption = 'all';
    // 板块选中
    @observable activeModule = 'sales';
    // 总代列表
    @observable headsection = [];
    // 分代列表
    @observable subsection = [];
    // 分代初始
    @observable subInit = 'all';
    // 数据类型
    @observable dataType = '销量';
    // 总代名称
    @observable headName = '';
    @observable headId;
    // 分代名称
    @observable subName= '';
    @observable subId;
    
    // ID名称
    @observable IdName = 'ID';
    // 起止时间
    @observable startAt = new Date();
    // 结束时间
    @observable endAt = new Date();

    // 查询数据
    @observable userId;
    @observable data;
    @observable currentData = {
        type1: null,
        type2: null,
        type3: null
    };
    @observable loading = false;
    //返佣提示
    @observable isRebates = false;
    @observable isAllClear = false;
    @observable isClear = false;
    
    state = {
        userId: undefined,
    }
    @action
    async componentDidMount() {
        if (_.isNil(authStore.authType)) {
            authStore.fetchAuth(this.mount, this.props.id);
        } else {
            this.mount();
        }
    }
    // 初始状态
    mount = async () => {
        let data = {
            startDate: moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            types: [1]
        };
        if (authStore.authType > 0) {
            let data = {
                startDate: moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endDate: moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                types: [1,2,3]
            };
            data.userId = authStore.userId;
            this.fetchData(data, 'current');
        } else if (authStore.authType === 1) {
            data.userId = authStore.userId;
            this.fetchData(data);
        } else {
            this.fetchData(data);
        }
        try {
            if (authStore.authType === 1) {
                const res = await DS.query(`users/${authStore.userId}/children`, {isFlat: true})
                runInAction(() => {
                    this.subsection = _.filter(res.source.children, o => o.roleId === 2);
                });
            } else if (authStore.authType === 0) {
                const res = await DS.query('users/list', {roleId: 1})
                runInAction(() => {
                    this.headsection = res.data;
                });
            }
        } catch (error) {
            console.error(error, 'fcontentmount');
        }
    }

    @action changeStart = value => {
        this.data = null;
        this.startAt = value;
        const typeObj = {
            '充值': 2,
            '销量': 1,
            '返佣': 3
        }
        let data = {
            startDate: moment(value).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(this.endAt).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            types: [typeObj[this.dataType]]
        };
        // if (authStore.authType === 0) {
        //     data.userId = this.userId
        // } else {
        //     data.userId = this.userId || authStore.userId
        // }
        if (authStore.authType > 1) {
            console.log(this.userId ,authStore.userId,this.subId)
            data.userId = this.userId || authStore.userId;
        }else if(authStore.authType === 1){
            if(this.subId === 'all' || !this.subId){
                data.userId = authStore.userId;
            }
        }else{
            if(this.subId=== "all" && this.headId !== "all"){
                data.userId = this.headId;
            }
        }
        this.fetchData(data);
    }

    @action changeEnd = value => {
        this.endAt = value;
        const typeObj = {
            '充值': 2,
            '销量': 1,
            '返佣': 3
        }
        let data = {
            startDate: moment(this.startAt).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(value).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            types: [typeObj[this.dataType]]
        };
        // if (authStore.authType === 0) {
        //     data.userId = this.userId
        // } else {
        //     data.userId = this.userId || authStore.userId
        // }
        if (authStore.authType > 1) {
            console.log(this.userId ,authStore.userId,this.subId)
            data.userId = this.userId || authStore.userId;
        }else if(authStore.authType === 1){
            if(this.subId === 'all'|| !this.subId){
                data.userId = authStore.userId;
            }
        }else{
            console.log(this.subId)
            if(this.subId=== "all" && this.headId !== "all"){
                data.userId = this.headId;
            }
        }
        this.fetchData(data);
    }

    // 获取查询数据
    @action fetchData = async (data, type) => {
        this.loading = true;
        try {
            if (!data.userId || data.userId === 'all') {
                delete data.userId;
            }
            let res;
            if(data.userId &&  typeof data.userId == 'string'){
                data.userId = parseInt(data.userId)
            }
            if (type === 'current') {
                res = await DS.create('finance/subs', data);  
            } else {
                res = await DS.create('finance/subs', data);
            }
            runInAction(() => {
                if (type === 'current') {
                    this.currentData = res.source;
                    // 进来显示今日数据
                    this.data = res.source && res.source.type1;

                }else if (_.get(res, 'source.type1')) {
                    this.data = res.source.type1;
                } else if (_.get(res, 'source.type2')) {
                    this.data = res.source.type2;
                } else if (_.get(res, 'source.type3')) {
                    this.data = res.source.type3;
                } else {
                    this.data = null;
                }
            })
        } catch (error) {
            console.error(error, 'fetchData');
        }
        this.loading = false;
    }
    // 返佣
    @action onBack = async () => {
        this.isRebates = true;
        try {
            await DS.create('finance/rakeback').then(res =>{
                if (res.source.result) {
                    this.successToast()   
                } else if (res.source.code && res.source.code === 110) {
                    this.failToast('今日已返佣，请明日操作')   
                } else if(res.source.code && res.source.code === 113){
                    this.failToast('当前无用户可操作')   
                }else{
                    this.failToast('返佣失败')   
                }
            })
        } catch (error) {
             this.isRebates = false;
            console.error(error, 'onBack');
        }
        this.isRebates = false;
    }

    @action
    changeVisible = (type) => {
        if (type === 'id') {
            prompt(
                'ID查询',
                '',
                [
                    { text: '取消',onPress:value => this.onClose() },
                    { text: '查看结果', onPress: value => this.onPress('id', value) },
                ],
                '',
                null,
                ['请输入节点ID来查询结果']
            )

        } else if (type === 'sales') {
            operation([
                { text: '充值', onPress: () => this.onPress('sales', '充值') },
                { text: '销量', onPress: () => this.onPress('sales', '销量') },
                { text: '返佣', onPress: () => this.onPress('sales', '返佣') }
            ])
        }else {
            this.modalType = type;
            this.visible = true;
        }
        this.activeModule = type;
    }

    @action
    onClose = () => {
        this.visible = false;
    }

    activeFilter(key) {
        if (key === 'role1') {
            return classNames({
                'active': this.activeModule === 'role1' || this.activeModule === 'role2'
            });
        }
        return classNames({
            'active': this.activeModule === key
        });
    }
    @action
    actionOption = key => {
        console.log(this.activeOption)
        if(this.modalType === 'role2'){
            
        }
        return classNames({
            'activeOption': this.activeOption === String(key) ,
            'border-bottom': this.activeOption !== String(key)
        })
    }
    // 分代
    @action
    changeOption = e => {
        const value = e.target.getAttribute('value');
        this.subId = value;
        this.activeOption = value;
        this.subName = _.get(_.find(this.subsection, {id: Number(value)}), 'agentName');
    }

    //总代
    @action
    changeSubOption = async e => {
        const value = e.target.getAttribute('value');
        this.activeOption = value;
        this.headId = value;
        if (value === 'all') {
            this.headName = '';
        } else {
            this.headName = _.get(_.find(this.headsection, {id: Number(value)}), 'agentName');
            try {
                const res = await DS.query(`users/${value}/children`, {level: 1});
                runInAction(() => {
                    this.subsection = res.source.children;
                })
            } catch (error) {
                console.error(error, 'changeSubOption');
            }
        }
    }

    @action
    onPress = (type, value) => {
        if (!value && value=='') {
           return this.onClose()
        }
        const typeObj = {
            '充值': 2,
            '销量': 1,
            '返佣': 3
        }
        let data = {
            startDate: moment(this.startAt).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(this.endAt).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        };
        if (type === 'sales') {
            this.dataType = value;
            
            // data.value = this.userId;
            data.value = this.userId;
            data.userId = this.userId 
        
            if (authStore.authType > 1) {
                data.userId = this.userId || authStore.userId;
            }else if(authStore.authType === 1){
                if(this.subId === 'all'){
                    data.userId = authStore.userId;
                }
            }else{
                if(this.subId=== "all" && this.headId !== "all"){
                    data.userId = this.headId;
                }
            }
        } else if (type === 'id') {
            this.IdName = value;
            this.headName = '';
            this.subName = '';
            this.userId = Number(value);
            data.userId = Number(value);
        } else {
            this.IdName = '';
            if (this.activeOption === 'all') {
                data.userId = this.headId || authStore.userId;
            } else {
                data.userId = Number(this.activeOption);
                this.userId = Number(this.activeOption);
            }
            if (type === 'role1') {
                this.subName = '';
                this.userId = Number(this.activeOption);
            }
        }
        data.types = [typeObj[this.dataType]]
        this.fetchData(data);
        this.onClose();
    }
    
    renderModal = () => {
        let title;
        let options;
        const headsection = toJS(this.headsection);
        if (this.modalType === 'role1') {
            title = '总代列表';
            options = headsection.map(o => {
                return (
                <p
                    className={this.actionOption(o.id)} 
                    value={o.id}
                    key={o.id}
                    onClick={this.changeSubOption}
                >
                    {o.agentName}
                </p>
            )} );
        } else if (this.modalType === 'role2') {
            title = '分代列表';
            const subsection = toJS(this.subsection);
            
            options = subsection && subsection.map(o => (
                <p 
                    className={this.actionOption(o.id)} 
                    value={o.id}
                    key={o.id}
                    onClick={this.changeOption}
                >
                    {o.agentName}
                </p>
            ));
        }
        return (
            <Modal
                visible={this.visible}
                transparent
                closable ={true}
                maskClosable={false}
                onClose={() => this.onClose()}
                title={title}
                footer={[{ text: '查看结果', onPress: () => this.onPress(this.modalType, this.activeOption) }]}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                className="roleModal"
            >
                <div className="content">
                    {/* <span className="closeModel"><i className="iconfont icon-guanbi" onClick={()=>this.changeVisible('close')}></i></span> */}
                    <p
                        className={this.actionOption('all')} 
                        onClick={this.modalType === 'role2' ? this.changeOption : this.changeSubOption} 
                        value='all' key='all'
                    >
                        全部
                    </p>
                    {options}
                </div>
            </Modal>
        )
    }
    // formatPrice = num => String(parseInt(num)).replace(/\d(?=(?:\d{3})+\b)/g,'$&,');
    //formatPrice = num => String(parseInt(num/100).toFixed(2))
    
    formatPrice = num => String(parseFloat(num / 100).toFixed(2));   
    
    render() {
        // console.log(now,utcNow)
        // 是否显示分代选项
        const hideSubSection = _.isEmpty(this.subsection)||this.headId==='all';
        return (
            <div style={{paddingTop: 60}}>
                <Top title="财务管理" id={this.props.id}/>
                {
                    authStore.authType > 0 &&
                    <ul className="todayFinance">
                        <li>
                            <span>今日返佣</span>
                            <p>{parseFloat(this.currentData.type3) >= 0? `¥ ${(parseFloat(this.currentData.type3)/100).toFixed(2)}`:"--"}</p>
                        </li>
                    
                        <li>
                            <span>今日充值</span>
                            <p>{parseFloat(this.currentData.type2) >= 0? `¥ ${(parseFloat(this.currentData.type2)/100).toFixed(2)}` :"--"}</p>
                        </li>
                        <li>
                            <span>今日销量</span>
                            <p>{parseFloat(this.currentData.type1) >= 0? `¥ ${(parseFloat(this.currentData.type1)/100).toFixed(2)}` :"--"}</p>
                        </li>
                    </ul>
                }
                <div className="content">
                    <div style={{marginBottom: 10, marginTop: 10}}>
                        <DatePicker
                            mode="date"
                            title="选择起止时间"
                            extra="Optional"
                            maxDate={now}
                            value={this.startAt}
                            onChange={this.changeStart}
                        >
                            <List.Item arrow="horizontal">起止时间</List.Item>
                        </DatePicker>
                    </div>
                    <div style={{marginBottom: 10}}>
                        <DatePicker
                            style={{marginBottom: 10}}
                            mode="date"
                            title="选择结束时间"
                            extra="Optional"
                            maxDate={now}
                            value={this.endAt}
                            onChange={this.changeEnd}
                        >
                            <List.Item arrow="horizontal">结束时间</List.Item>
                        </DatePicker>
                    </div>
                    <div className="finance-search-list">
                        <Button className='active' onClick={() => this.changeVisible('sales')}>{this.dataType} </Button>
                        {
                            authStore.authType === 0 && 
                            <Button className={this.activeFilter('role1')} onClick={() => this.changeVisible('role1')} >
                                {this.headName ? <span>总代：{this.headName}</span> : '总代：全部'}
                            </Button>
                        }
                        {
                            authStore.authType < 2 && 
                            <Button className={this.activeFilter('role2')} onClick={() => this.changeVisible('role2')} disabled={hideSubSection}>
                                {this.subName ? <span>分代：{this.subName}</span> :'分代：全部'}
                            </Button>
                        }
                        {
                            authStore.authType === 0 && 
                            <Button className={this.activeFilter('id')} onClick={() => this.changeVisible('id')}>
                                {this.IdName || 'ID'}
                            </Button>
                        }
                    </div>
                    <p>查询结果</p>
                    <p style={{textAlign: 'center', fontSize: '1rem', padding: '20px 0', color: '#FEC105'}}>{parseFloat(this.data) >= 0 ? `¥ ${this.formatPrice(this.data)}` : '--'}</p>
                    {this.visible && this.renderModal()}
                </div>
                {authStore.authType === 0 && <p className="addIcon"  onClick={_.debounce(this.onBack,200)}><span>返佣</span></p>}
            </div>
        )
    }
    successToast() {
        Toast.success('返佣成功', 2);
    }

    failToast(tips) {
        Toast.fail(tips, 3);
    }
}


export default FContent;
