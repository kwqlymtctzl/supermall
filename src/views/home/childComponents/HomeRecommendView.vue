<template>
  <div class="recommend">
    <div v-for="item in recommends" :key="item.acm" class="recomment-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeRecommendView",
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>


<style scoped>
.recommend {
  /* flex水平布局，否则四个div竖着排列 */
  display: flex;
  width: 100%;
  text-align: center;
  font-size: 12px;
  /* 上下边距 */
  padding: 10px 0 20px;
  /* 底部那条线 */
  border-bottom: 10px solid #eee;
}
.recommend-item {
  /* 居中均等分 */
  flex: 1;
}
/*写.recommend-item img 不起作用  */
img {
  /* 100%图片就黏在一起了 */
  width: 90%;
  /* 字体跟图片的距离 */
  margin-bottom: 10px;
}
</style>