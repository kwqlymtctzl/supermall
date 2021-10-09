<template>
  <!-- ref如果绑定在组件中，那么通过this.$refs.refname获取的是一个组件对象 -->
  <!-- ref如果绑定在普通元素，那么通过this.$refs.refname获取的是一个元素对象 -->
  <!-- 这里是绑定普通元素div上，以前讲过$ref用于父组件访问子组件 -->
  <div class="wrapper" ref="aaa">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  mounted() {
    // 1.创建BScroll对象
    //   document.querySelector的方法不好，如果APP.vue里面也有class="wrapper",那这里拿到的就可能出错
    // this.scroll = new BScroll(document.querySelector(".wrapper"));
    // new 了一个BSscroll对象给data里面的scroll,所以下面用到的this.scroll都是data里面的scroll，都有new带来的方法
    this.scroll = new BScroll(this.$refs.aaa, {
      click: true,
      //probeType: 3, //这里不应该写死，因为有的组件在复用时可能不需要这个，而这里写3还是会执行下面的监听，会影响性能
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    }); //这里拿到的就一定是上面的div

    // console.log(this.scroll);

    //  2.监听滚动的位置,必须有probeType才起效
    if (this.probeType === 2 || this.probeType === 3)
      this.scroll.on("scroll", (position) => {
        //   console.log("position");
        this.$emit("scroll", position);
      });

    //3.监听上拉事件
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        console.log("滚动到底部");
        this.$emit("pullingUp"); //在scroll.vue监听到滚动到底部，需要发射事件通知home.vue去请求下一页数据
      });
    }
  },
  methods: {
    //这里是backTop调用scrollTo方法的封装，home.vue的backTop组件监听点击并调用scrollTo函数this.$refs.scroll.scrollTo(0, 0)
    // this.scroll.scrollTo(0, 0);
    //300ms
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    refresh() {
      console.log("防抖动"); //发现打印一次防抖动，可以把监听时间设置短一点，这样就可以看到防抖动的效果,看不懂多次打印是因为浏览器缓存的问题
      this.scroll && this.scroll.refresh();
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
      // 先判断scroll有没有值
    },
  },
};
</script>

<style>
</style>