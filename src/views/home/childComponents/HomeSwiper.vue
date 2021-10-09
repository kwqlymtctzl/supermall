<template>
  <!-- swiper这个标签的作用应该是将每个swiper-item做成轮播图 -->
  <swiper>
    <!-- swiper-item的作用是遍历轮播图的每一个小组件 -->
    <!-- 后面要加 :key="item.acm"，不然不显示图片-->
    <swiper-item v-for="item in banners" :key="item.acm">
      <!-- 这里记得动态绑定，item.link是一个地址，加了冒号item.link就是一个变量，救恩那个拿到地址，不然就是一个字符串
      在devtools可以看到banners里面有link,image这些属性，是请求数据拿到的banner.list里面的东西 -->
      <!-- 图片具有点击效果，所以a标签，但是点击a好像发送了网络请求 -->
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper/index";

export default {
  name: "HomeSwiper",
  props: {
    // 父传子，从home拿到banner数据
    banners: {
      typr: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isLoad: false,
    };
  },
  components: {
    Swiper,
    SwiperItem,
  },
  methods: {
    imageLoad() {
      //console.log("轮播图加载完"); //打印了4次'轮播图加载完',说明出发了4次imageLoad,发射了4次swiperImageLoad事件，但是这里没有必要发射4次事件，因为这里只需要轮播图的一张图片撑开高度，让offsetTop获取正确的高度即可，当然4次也可以
      if (!this.isLoad) {
        //监听到轮播图第一张图片加载完，触发imageLoad函数，发射swiperImageLoad事件
        this.$emit("swiperImageLoad");
        this.isLoad = true; //这样监听到轮播图第二三四张图片加载完,就不会再发射事件了
      }
    },
  },
};
</script>

<style>
</style>