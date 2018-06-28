const util = {
  getArray : function (arr) {
    return arr || [];
  },
  getCounts : function (data){
    console.log(data, 'data')
    // 当前用户code长度
    const nowCodeLenth = data.code.length;
    // 一级子代
    const first = this.getArray(data.children).filter(item => item.code.length === nowCodeLenth + 4);
    // 二级子代
    const second = this.getArray(data.children).filter(item => item.code.length === nowCodeLenth + 8);
    // 所有子代
    const allCounts = this.getArray(data.children).length;
    // 一级正常子代
    const firstNormalCounts = first.filter(item => item.status === 1);
    return {
      firstCounts: first.length,
      firstNormalCounts,
      secondCounts: second.length,
      allCounts
    }
  }
}

export default util;
