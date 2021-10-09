<template>
  <!-- 监听点击事件可以在div加这个@click="backClick"，然后下面methods利用$emit发射事件，home.vue接收事件然后想办法拿到scroll组件去调用scroll对象的scrollTo方法，但是不如直接在home监听 -->
  <!-- 也可以在Home.vue的组件上面监听 -->
  <div class="back-top">
    <img src="@/assets/images/common/top.png" alt="">
  </div>
</template>

<script>
export default {
  name: "BackTop",
  //   methods: {
  //     backClick() {
  //       console.log("回到顶部");
  //     },
  //   },
};
</script>

<style scoped>
/* 脱离标准流，滚动也脱离标准流，但这个在滚动的上面 */
.back-top {
  position: fixed;
  right: 8px;
  bottom: 55px;
}
.back-top img {
  width: 44px;
  height: 44px;
}
</style>
