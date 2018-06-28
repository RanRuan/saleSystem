import { observable, action, runInAction } from 'mobx';
import DS from '../util/dataSource';
import _ from 'lodash';

class Rebate {
  @observable nowRate;
  @observable historyRate;
  @observable updated = false;
  @action fetchNow = async cb => {
    try {
      const res = await DS.query('roles');
      runInAction(() => {
        const role = _.get(res, 'source.roles');
        const nowRate = {
          headRate: _.round(_.get(_.find(role, {id: 1}), 'CRate.rate') * 100, 2),
          subRate: _.round(_.get(_.find(role, {id: 2}), 'CRate.rate') * 100, 2),
          childRate1: _.round(_.get(_.find(role, {id: 3}), 'CRate.rate') * 100, 2),
          childRate2: _.round(_.get(_.find(role, {id: 3}), 'CRate2.rate') * 100, 2)
        }
        this.nowRate = nowRate;
        cb(nowRate);
      })
    } catch (error) {
      console.error(error, 'fetchNow');
    }
  }
  @action fetchHistory = async () => {
    try {
      const res = await DS.create('finance/rates');
      runInAction(() => {
        const dateGroup = _.map(_.groupBy(res.data, 'createdAt'), o => ({
          createdAt: _.get(o[0], 'createdAt'),
          headRate: _.get(o[0], 'rate'),
          subRate: _.get(o[1], 'rate'),
          childRate1: _.get(o[2], 'rate'),
          childRate2: _.get(o[3], 'rate'),
        }));
        this.historyRate = dateGroup;
      })
    } catch (error) {
      console.error(error, 'fetchHistory');
    }
  }

  @action updateRate = async (data, cb) => {
    this.updated = true;
    try {
      await DS.update('finance/rates', {updates: data});
      this.fetchNow(cb);
      this.fetchHistory()
    } catch (error) {
      this.updated = true;
      
      console.error(error, 'updateRate');
    }
    this.updated = false;
  }
}

export default new Rebate();
