<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!-- 这里的top-images原本是驼峰，写在这里便横杠 -->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-params-info :param-info="paramInfo" ref="params"></detail-params-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addShopCart="addShopCart"></detail-bottom-bar>

    <!-- @click不能直接监听组件，需要加.native,以前v-on讲过.native--监听组件根元素的原生事件，不加这个写在组件上是监听子组件的事件 -->
    <back-top @click.native='backClick' v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import Scroll from "components/common/scroll/Scroll";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamsInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";
import GoodsList from "components/content/goods/GoodsList";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";
import BackTop from "components/content/backTop/backTop.vue";

import { debounce } from "common/utils.js";

import {
  getDetail,
  Goods,
  Shop,
  GoodParam,
  getRecommend,
} from "@/network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamsInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    BackTop,
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {}, //因为props需要传的是Object,组件标签动态Details.vue的data的goods写的是null,改为空对象{}
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      itemImgListener: null,
      newRefresh: null,
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShowBackTop: false, //backTop的参数
    };
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid;

    //2.根据iid请求详情页数据
    getDetail(this.iid).then((res) => {
      //(1)获取数据
      console.log(res);
      const data = res.result;
      //(2)获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages; //保存到topImages,这样data就拿到了数据，就可以在devtools看到数据了，另外真实开发是自己去找到数据放在哪里的

      //(3)获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //(4)创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      //(5)获取商品详细信息
      this.detailInfo = data.detailInfo;

      //(6)获取参数的信息
      this.paramInfo = new GoodParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      //(7)取出评论信息
      //判断评论数
      if (data.rate.cRate !== 0) {
        // 为什么就拿一条评论
        this.commentInfo = data.rate.list[0];
      }

      this.$nextTick(() => {
        //这个$nextTick根据最新的数据，对应的DOM是已经被渲染出来了,就执行一次
        // 但是如果离开组件再回来，缓存的图片就会不见，重新加载图片
        // 但是图片依然是没有加载完,拿到的offsetTop不一定是准确的，计算出来的高度确定下来了，等图片加载完，再使用跳转就出现跳的位置不对的问题
      });
    });

    //3.请求推荐信息的数据
    getRecommend().then((res) => {
      console.log(res);
      this.recommends = res.data.list;
    });

    //4.给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      console.log(this.themeTopYs);
    }, 100);
  },
  mounted() {
    //防抖
    this.newRefresh = debounce(this.$refs.scroll.refresh, 0.01);
    this.itemImgListener = () => {
      this.newRefresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  },
  destory() {
    //2.取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    imageLoad() {
      console.log("---");
      this.newRefresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300);
    },

    //监听滚动事件回调函数：拿到具体位置，i值等于不同的index
    contentScroll(position) {
      //1.获取y值,position.y拿到的是负值
      const positionY = -position.y;

      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        //length改为length-1,因为数组自己手动增加了一个，后面那个区间不需要判断
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      //backTop
      this.isShowBackTop = -position.y > 1000;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    addShopCart() {
      //1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2.将商品添加到购物车
      this.$store.commit("addCart", product); //修改state的状态都要通过mutation
    },
  },
};
</script>

<style scoped>
#detail {
  /* position: relative; */
  /* z-index: 9999; */
  /* background-color: #fff; */
  height: 100vh;
}

.content {
  height: calc(100% - 44px - 49px);
  /* 这里的100%是根据父的高度来决定的，而父的高度由内容撑开，滚动区域就会很大，所以要给父级100vh一个确定的高度 */
  overflow: hidden;
}
</style>
