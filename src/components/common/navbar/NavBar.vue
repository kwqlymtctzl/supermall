<template>
  <!-- TarBer.vue使用id，是因为唯一性，这个导航每个组件都要用，有很多个，所以用class -->
  <div class="nav-bar">
    <!-- 这里为什么弄三个插槽，导航栏只有一个购物车，一个插槽就好了呀，因为这是一个可复用的组件，导航栏这里虽然用不着找三个插槽，但在别处复用的时候用得着 -->
    <!-- 不能在slot用class布局，所以多弄个div包起来，在div上布局 -->
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
/* scoped 样式仅作用于当前文件*/
/* 导航栏因为复用的原因，这里只写公共的样式，导航栏在home.vue的样式在home.vue里面写 */

/*  因为导航栏的宽度自适应，所以采用flex布局*/
.nav-bar {
  display: flex;
  /* 导航栏高度一般都是44px，设置就能上下居中，将整个div撑起来,需要有内容才起效果,所以多加height */
  line-height: 44px;
  height: 44px;
  /* 文字居中 */
  text-align: center;
  box-shadow: 0 1px 1px rgba(100, 100, 100, 0.1);
  /* background: pink;这背景颜色是刚开始为了方便调试弄的，导航栏背景颜色不能设在这里，因为这是个公共组件，只有首页才是pink,应该写在Home */
}

/* 给其他盒子宽度，剩余空间平分给其他盒子 */
/* flex布局已经按顺序给三个盒子排列好了，不用浮动 */
.left,
.right {
  width: 60px;
  /* background: red;这背景颜色是刚开始为了方便调试弄的 */
}

.center {
  /* 给了left和right确定的宽度,就剩这个，flex:1就会占据剩下的，自适应 */
  flex: 1;
  /* background: blue; 这背景颜色是刚开始为了方便调试弄的 */
}
</style>