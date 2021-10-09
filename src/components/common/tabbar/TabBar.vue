<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabBar",
};
</script>

<style scoped>
/* 想要水平分布，flex布局, 只是水平紧贴在一起 */
#tab-bar {
  display: flex;
  background-color: #fff;
  /* 定位，使tabbar在下面,不用  left: 0;right: 0;会在左下角缩在一起*/
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  /* 加点阴影 */
  box-shadow: 0 -1px 1px rgba(100, 100, 100, 0.2);
  z-index: 999;
}
</style>