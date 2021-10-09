import Vue from 'vue'
import Vuex from 'vuex'

//1.安装插件
Vue.use(Vuex)

//2.创建store对象
export default new Vuex.Store({
  state: {
    shopList: []
  },
  mutations: {
    addCart(state, payload) {
      let oldProduct = null;
      for (let item of state.shopList) {   //把state.cartList数组里面的成员的值给item
        if (item.iid === payload.iid)//判断传进来的对象的iid是否跟数组里面成员的iid相同，相同说明里面已经有这个商品对象了
          oldProduct = item  //赋值给oldProduct
      }
      if (oldProduct) {     //上面如果已经有该商品对象了，就赋值给oldProduct,就添加count属性记录添加的数量
        oldProduct.count += 1
      } else {     //如果该数组里面还没有传进来的商品对象，就记录数量为1，然后push进去
        payload.count = 1 //这里是给每次payload记录属性，因为此时oldProduct为null,没有count
        payload.checked = true
        state.shopList.push(payload)
      }

    }
  },
  actions: {
  },
  modules: {
  }
})
