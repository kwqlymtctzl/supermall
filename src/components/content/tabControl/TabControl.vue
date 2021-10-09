<template>
  <div class="tab-control">
    <!-- 这里没有必要像导航栏那样弄个多个插槽，因为这里跟分类组件只有文字不一样,没必要两次使用都插入多个div,而导航栏三个插槽在每个组件都有不同的样子，所以用插槽 -->
    <div v-for="(item,index) in titles" :key="item" class="tab-control-item" :class="{active:index===currentIndex}" @click="itemClick(index)">
      <!--这里 :class="{active:index===currentIndex}"  的index不是需要点击才有的，在遍历的时候就分配好0.1.2，所以一开始currentIndex：0，就匹配上index为0的'流行'-->
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  //   记录谁被选中
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      // 子传父
      this.$emit("tabClick", index);
    },
  },
};
</script>

<style scoped>
.tab-control {
  display: flex;
  text-align: center;
  font-size: 15px;
  /* 下面这两个可以继承给.tab-control-item */
  height: 40px;
  line-height: 40px;
  background-color: #fff;
}
.tab-control-item {
  flex: 1;
}
/* 粉色底线与文字太近 */
.tab-control-item span {
  padding: 5px;
}
/* 那个活跃哪个变颜色 */
.active {
  color: var(--color-high-text);
}
/* 粉色底线 */
.active span {
  border-bottom: 3px solid pink;
}
</style>