<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-avtive"></slot>
    </div>

    <!-- 想要活跃时文字变化，但是不行，因为这里是插槽，是会被替换的，被替换的标签里面没有active属性，所以全部都应该给插槽放在带有active属性的div, -->
    <!-- <slot :class="{ active: isActive }" name="item-text"></slot> -->
    <!-- 应该这样做，也可以把class加到最上面的div，但这样全部都会变红 -->
    <!-- <div :class="{ active: isActive }"><slot name="item-text"></slot></div> -->
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    //父组件向子组件传path的值,但是MainTabBar导入注册TabBarItem,APP又导入注册MainTabBar，APP与TabBarItem应该是爷孙组件关系
    path: String,
    activeColor: {
      type: String,
      default: "red", //没有传颜色就默认红色，这样第9行绑定的class就没用了
    },
  },
  data() {
    return {
      //   isActive: true,//写死的，达不到目的,利用计算属性
    };
  },
  computed: {
    isActive() {
      //this.$route指活跃路由，判断活跃路由的path是否含有item的path，含有就不等于-1，就变为true,其他为false
      // 点击首页时
      // /home --是否等于-->item1(/home)=true
      // /home --是否等于-->item1(/category)=false
      // /home --是否等于-->item1(/cart)=false
      // /home --是否等于-->item1(/profile)=false
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle() {
      //判断是否活跃，活跃就{ color: this.activeColor }
      return this.isActive ? { color: this.activeColor } : {};
    },
  },
  methods: {
    itemClick() {
      this.$router.replace(this.path).catch((err) => err);
    },
  },
};
</script>

<style scoped>
/* 父组件TarBar设了display:flex，这里是子组件 */
/* 使距离均等分，貌似只有三个属性值-1,0,1， */
.tab-bar-item {
  flex: 1;
  text-align: center;
  /* tab-bar-item常用高度就是49px */
  height: 49px;
  /* 改小文字大小 */
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  /* 图片上方保留些许空白 */
  margin-top: 3px;
  /* 图片与文字基线对齐，所以图片一般下面都默认多出了3个像素 */
  vertical-align: middle;
  /* 间隔改成2px */
  margin-bottom: 2px;
}

.active {
  color: red;
}
</style>