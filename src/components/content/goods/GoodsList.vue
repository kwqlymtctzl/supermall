<template>
  <div class="goods">
    <!-- 数据固定的，不用插槽 -->
    <!-- :goods-item="item" 把数据传给GoodsListItem -->
    <goods-list-item v-for="item in goods" :key="item.acm" :goods-item="item"></goods-list-item>
  </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem.vue";

export default {
  name: "GoodsList",
  components: {
    GoodsListItem,
  },
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.goods {
  display: flex;
  /* 避免flex布局，全部子组件都放在一行，默认nowrap不包裹，wrap根据宽度放 */
  flex-wrap: wrap;
  /* 图片间隙空白处均等分，页面两边的空白加起来等于中间的空白，如果一行有三张图片，会自动调整 */
  justify-content: space-around;
  background-color: var(--color-background);
  padding: 2px;
}
</style>
