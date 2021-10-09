<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{$store.state.shopList.length}})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <scroll class="content" ref="scroll">
      <cart-list></cart-list>
    </scroll>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>
<script>
import NavBar from "components/common/navbar/NavBar.vue";
import CartList from "./childComps/CartList.vue";
import Scroll from "components/common/scroll/Scroll";
import CartBottomBar from "./childComps/CartBottomBar.vue";

// import { mapGetters } from "vuex";
export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    Scroll,
    CartBottomBar,
  },
  activated() {
    this.$refs.scroll.refresh(); //Cart在APP是放在缓存里面的，每次添加数据时由于scrollHeight已经确定了，所以要刷新重新计算高度
  },
  computed: {
    // ...mapGetters({
    //   cartLength: "cartLength",
    // }),
  },
};
</script>
<style scoped>
.cart {
  position: relative;
  height: 100vh;
}

.nav-bar {
  background: var(--color-tint);
  color: #fff;
}

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 89px;
  left: 0;
  right: 0;
}
</style>