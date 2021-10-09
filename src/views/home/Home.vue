<template>
  <div id="home">
    <nav-bar class="home-nav">
      <!-- 这个是首页特有的，不应该放在导航栏,属性是匹配并放到center插槽，其他两个left,right插槽正常显示 -->
      <div slot="center">购物街</div>
    </nav-bar>

    <tab-control class="tab-control" :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref='tabControl1' v-show="isTabFixed"></tab-control>

    <!-- better-scroll实现滚动，导航栏不滚动不需要 ,但不应该这样做，应该封装-->
    <!-- <div class="wrapper">
         <div class="content">

         </div>
         </div> 
    -->
    <!-- 封装为scroll.vue, scroll只保证能够滚动, 但还要确定高度，不同页面复用时有自己的滚动高度，所以写在这里 -->
    <!-- 不加冒号就是字符串，加了就是确定为Number类型 ，就像加了就是变量一样-->
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <!-- 动态绑定，没有这个只显示第一张图片？ -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <!-- 省略冒号会传个字符串过去了;这里是滚动区域,且tab-control组件里面的div有@click监听事件,需要在scroll.vue加click:true才能起效;如果是button则不需要 -->
      <tab-control class="tab-control" :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref='tabControl2'></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- @click不能直接监听组件，需要加.native,以前v-on讲过.native--监听组件根元素的原生事件，不加这个写在组件上是监听子组件的事件 -->
    <back-top @click.native='backClick' v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
//导入子组件
import HomeSwiper from "./childComponents/HomeSwiper.vue";
import RecommendView from "./childComponents/HomeRecommendView.vue";
import FeatureView from "./childComponents/FeatureView.vue";
// 导入公共组件
import NavBar from "components/common/navbar/NavBar.vue";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList.vue";
// import BScroll from "better-scroll"; 但是这样耦合度太高，better-scroll不维护就要一个个改，因为别的三个组件也用到了better-scroll,应该封装
import Scroll from "components/common/scroll/Scroll.vue";
import BackTop from "components/content/backTop/backTop.vue";

// 导入方法
import { getHomeMultidata, getHomeGoods } from "@/network/home"; //要用default导出才能把大括号删掉
import { debounce } from "common/utils.js";

export default {
  name: "Home",
  components: {
    // 组件注册也跟上面导入顺序
    HomeSwiper,
    RecommendView,
    FeatureView,

    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    //把请求的数据保存起来，因为getHomeMultidata()是一个函数，函数执行完后，函数里面的参数都是局部变量，用完就会被销毁
    //函数调用-->压入函数栈(保存函数调用过程中所有变量)
    //函数调用结束-->弹出函数栈(释放函数所有的变量)
    //再调用一次这些变量就会重新创建,然后再一次销毁
    return {
      // result: null, //空对象
      //一般分开拿
      banners: [], //拿到的数组，这里自然也要是数组
      recommends: [],
      goods: {
        pop: { page: 0, list: [] }, //这里的pop/new/sell不是乱写的，接口写的啥就是啥
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop", //点击tabcontrol的三个按钮会修改这里，下面就会展示不同的商品
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      itemImgListener: null,
    };
  },
  // 十一：TabControl的封装
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },

  // 七：请求首页的多个数据
  created() {
    //1.获取多个数据：不仅有轮播图，还有其他图片
    //getHomeMultidata()返回home.js的返回值，而home.js的返回值是一个Promise对象
    // getHomeMultidata().then((res) => {
    //   console.log(res);
    //   // this.result = res;
    //   this.banners = res.data.banner.list;
    //   this.recommends = res.data.recommend.list;
    //1.this在箭头函数是往上找作用域，create有this,之前在created里面打印过一些东西，created里面的this就是当前的组件对象
    //2.垃圾回收机制：没有引用指向的时候就会回收，data的result不会被回收，永远引用的，现在this.result = res，result指向res对象的时候就已经把res对象保存下来了,所以函数执行完,result指向对象是不会被回收的
    // 其实res是指向请求过来的data数据对象,函数执行完，res被回收，就没有指针指向这个请求回来的数据，就会垃圾回收这个数据
    // this.result = res是把res的内存地址给result了，所以result也指向请求的数据data,函数执行完，res被回收,因为还有result指向它，所以这个数据不会被回收
    // });
    //验证result的数据:不能写在这里，因为上面是一个异步操作，大概率先执行这里，打印为空
    // console.log(this.result);
    // 应该通过devtools查看组件内容

    // 网络请求相关方法
    //1.获取多个数据，this是什么作用：调用下面methods的方法，为什么不直接在这里写，太臃肿
    this.getHomeMultidata();
    //2.请求商品数据
    this.getHomeGoods("pop"); //这里为什么加双引号，是因为下面的goods[type]写法,[]拿属性一般是有引号的
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    //组件一创建就要监听图片是否加载完成
    // 3.监听GoodListItem中图片是否加载完成

    //const refresh = this.debounce(this.$refs.scroll.refresh, 0.01); //this.$refs.scroll.refresh不加括号，因为传入的是一个函数，如果加括号就是把调用结果传进去
    //debounce被封装在utils.js,导入debounce就不用像上面写this了
    const refresh = debounce(this.$refs.scroll.refresh, 0.01);
    //上面的refresh是个局部变量，但是不会被销毁，因为下面有调用它refresh(),

    this.itemImgListener = () => {
      refresh();
    };

    // this.$bus.$on("itemImageLoad", () => {
    //   // this.$refs.scroll.refresh();这样refresh太过频繁刷新
    //   refresh();
    // });
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  },
  activated() {
    console.log("actived");
    console.log(this.saveY);
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    //1.保存Y值
    console.log("deactived");
    this.saveY = this.$refs.scroll.getScrollY();

    //2.取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    // debounce(func, delay) {
    //   let timer = null; //timer也是个局部变量，但是没有被销毁，因为内部的函数引用了它，形成闭包
    //   return function (...args) {
    //     //...argus是可以接收多个参数
    //     if (timer) clearTimeout(timer);
    //     timer = setTimeout(() => {
    //       func.apply(this, args); //apply可以改变this指向，否则this指向window
    //     }, delay);
    //   };
    // },

    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1; //上面data的page是0，页面一打开就请求，请求就+1
      getHomeGoods(type, page).then((res) => {
        //然后请求type分别等于'pop','new','shell'，page等于1的数据
        // console.log(res);
        // 箭头函数的this往外面找，这里的this都是当前的组件对象，所以能够通过this.goods拿到goods
        this.goods[type].list.push(...res.data.list); //三个点的作用是一个个取出来
        // 也可以通过for(let item of res.data.list){}进行遍历

        this.goods[type].page += 1; //把data中的page+1，上面的page+1只是用于获取请求数据的第几页

        //scroll默认只能上拉加载一次，所以每次完成上拉加载更多都要执行一次finishPullUp函数
        // this.$refs.scroll.scroll.finishPullUp();
        this.$refs.scroll.finishPullUp();
      });
    },

    // 十一：TabControl的封装
    //事件监听相关方法
    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 让better-scroll里的tabcontrol组件和外面的tabcontrol组件的点击保持一致，两个组件是分别创建的，不是同一个，都分别记录着各自的currentIndex
      this.$refs.tabControl1.currentIndex = index; //tabcontrol组件有个currentIndex记录点击了谁
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      // 通过父访问子拿到scrollTo方法去调用，这里是父组件，能够调用子组件里面的方法
      // console.log("回到顶部");
      //this.$refs.scroll.scroll.scrollTo(0, 0, 500); //this.$refs.scroll直接拿到scroll组件，后面第二个scroll是拿到scroll.vue里面的data中的scroll,500是毫秒再回到滑动区域的顶部
      //太长难看懂也可以封装在scroll.vue
      this.$refs.scroll.scrollTo(0, 0);
    },

    contentScroll(position) {
      //1.判断BackTop是否显示
      // console.log(position); //打印的y值都是负数,往下拉为负值
      this.isShowBackTop = -position.y > 1000;

      //2.决定tabControl是否吸顶(position:fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      // console.log("上拉加载更多");
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      //1.获取tabControl的offsetTop,不能在created写，否则this.$refs.tabControl拿到的是undefined所以在mounted挂载里面写
      //console.log(this.$refs.tabControl2.offsetTop); //undefined,this.$refs.tabControl拿到的是组件，组件是没有这个offsetTop属性的，应该拿tabControl组件里面模板中的元素，但是不能通过document.querySelector的方式获取，这样是不准确的
      //console.log(this.$refs.tabControl2.$el); //所有组件都有一个属性$el,用于获取组件中的元素
      //console.log(this.$refs.tabControl2.$el.offsetTop); //拿到的是一个不固定的数值，mounted是挂载的意思，确实所有的组件都已经挂载在上面了，但是图片不一定被加载完了, 可能有的图片高度还没有被撑起来，所以offsetTop拿到的高度是不固定的
      // 一般情况下是轮播图加载慢的原因，监听轮播图是否加载完成再获取offsetTop,但是老师这个方法不严谨呀,就监听轮播图，如果其他图片加载过慢呢
      //所以最终还是写在接收homeswiper组件发射事件触发的swiperImageLoad方法里面
      console.log(this.$refs.tabControl2.$el.offsetTop); //此时是固定的值
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop; //把值保存好

      //2.获取滚动的高度与tabOffsetTop对比,如果滚动高度大于tabOffsetTop就把tabControl改为固定定位
      //之前已经做了获取滚动高度的监听了，在上面的contentScroll方法：把比较结果赋值给isTabFixed，它的值为true/false,再在组件标签上做动态绑定class(:class="{fixed:isTabFixed}"),为true就有fixed属性，并在style写好样式
      // 但是并没有达到目的，tabControl滚动到导航栏下面会突然不见了,下面的goodslist瞬间跑到导航栏下面，这是因为tabControl变为固定定位，不占位置，goodslist就顶上去了，但是即使不占位置tabControl也应该停留在导航栏下面，但是他不见了
      // 为什么不见?这是与better-scroll内部的实现原理有关，正常滚动区域外面包了一层wrapper和content的div,better-scroll在content的div标签加了很多属性，在滚动时content中属性transfrom:translate(0,-90px)的translate在改变(element代码部分可以看到)，
      // 而fixed的位置也是可以被translate所改变，所以fixed随着滚动一起跑上去看不见了，所以在better-scroll里面做停留效果很难，把之前动态绑定class(:class="{fixed:isTabFixed}")删掉,复制一份tabControl组件标签放在导航栏下面(没在better-scroll里面)，这样由于导航栏是固定定位，tabControl跑到其下方，给他一个margin-top就可以了，
      // 或者取消导航栏的固定定位，之前使用固定定位是使用浏览器原生滚动的写法，导航栏会跟着往上滚，但是现在滚动区域只在中间滚动，导航栏有没有固定定位都一样，注释掉相关样式没有任何影响，tabcontrol就跑到导航栏下面了，被轮播图挡住了(注意此时不知什么原因better-scroll的样式方法一出问题了，只能有方法二的子绝父相，应该是calc方法的问题)
      // 所以给tabcontrol一个相对定位和z-index,即保留位置也跑到轮播图上面，然后在tabcontrol组件标签默认v-show="false"不显示，当better-scroll中的tabcontrol滚动到导航栏下方时就显示出来，然后两个tabcontrol就重叠了，继续往上滚，由于better-scroll内部的原因，它里面的tabcontrol组件就不见了，外面的tabcontrol还在，但给用户的视觉就是还在
      //  所以外面的tabcontrol组件标签v-show="isTabFixed"就可以随着滚动高度而显示隐藏了

      //3.另一个bug:better-scroll里的tabcontrol组件点击'精选'，滚到上面时，外面的tabcontrol组件显示的是'流行'，即两个tabcontrol组件不一致
      // 在tabClick方法加上两行代码，让better-scroll里的tabcontrol组件和外面的tabcontrol组件的点击保持一致
    },
  },
};
</script>

<style scoped>
/* 轮播图上面就多出44px */
#home {
  /* 1.配合scroll的第一个方法 */
  /* padding-top: 44px; 不需要了，本来导航栏在滑动区域的，需要给固定定位，不占位置，现在滑动区域不包括导航栏，不需要固定定位了*/
  /* vh-->viewport height视口宽度，但是这个100vh有什么用，但是不管better-scroll是方法一还是方法二都不能删掉 */
  height: 100vh;
  /* 关于height:100%和height:100vh的区别:vh就是当前屏幕可见高度的1%，也就是说height:100vh == height:100%;但是当元素没有内容时候，设置height:100%，该元素不会被撑开，此时高度为0，但是设置height:100vh，该元素会被撑开屏幕高度一致。*/
  /* 这里如果设置100%，则内容有多长，这个就多长 */
  /* 2.子绝父相，配合scroll的第二个方法 */
  position: relative;
}

.home-nav {
  background: var(--color-tint);
  color: #fff;

  /* 在使用浏览器原生滚动时，为了让导航栏不跟随一起滚动，现在滑动区域不包括导航栏，不需要固定定位了 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999; */
  /* 固定定位脱离标准流，不占位置，但是压不住图片，所以会被轮播图挡住，所以要z-index */
}

.tab-control {
  /* 这个属性比较新，要考虑兼容，但移动端没事，粘性定位在better-scroll失效了 */
  /* position: sticky; */
  /* top: 44px; */

  position: relative;
  /* 相对定位保留位置 */
  z-index: 9;
}

/* scroll.vue也有一个class="content"，会不会影响？不会，因为这里用了scoped */
.content {
  /* 方法一： */
  /* height: 574px;为了适应不同的手机，不能写死高度 */
  /* calc的运算符前后必须有空格 */
  /* height: calc(100% - 93px); */
  /* 但是这样写导航栏的固定定位还有粘性定位还有tabbar都有问题 */
  /* overflow: hidden; */
  /* margin-top: 44px; */
  /* 不能用padding,如果用padding,不起效，整体上移到导航栏下面,难道scroll不算一个真正的盒子？还是弹性盒子的原因？*/

  /* 方法二：或者子绝父相，
  1.给home一个相对定位，去掉padding-top,但是这样脱离标准流，如果后面还有东西，怎么办
  2.tabclick失效，需要在scroll.vue设置click:true,因为tab-control里面有监听tabClick，tab-control里面又有div的标签，而better-scroll只能监听button标签，其他标签必须加click:true;
  粘性定位失效了，因为不是原生的滚动了，是better-scroll在滚动，系统没法检查滚动到哪里了 */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/* 
.fixed {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
} */
</style>