<template>
  <div class="goods-item" @click="itemClick">
    <!-- 记得加冒号，否则是字符串 三十：商品推荐信息的展示-->
    <!-- <img :src="goodsItem.show.img" @load="imageLoad"> -->
    <img v-lazy="showImage" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      //在GoodsList通过:goods-item="item" 把数据传过来，名字必须对应的，左边是接收，右边是传送
      type: Object, //传过来的数据对应goods-->pop-->list-->Object的值,通过devtools查看，所以每个list就是一个小组件
      default() {
        return {};
      },
    },
  },
  //三十：商品推荐信息的展示
  computed: {
    showImage() {
      return this.goodsItem.image || this.goodsItem.show.img;
    },
  },

  methods: {
    imageLoad() {
      this.$bus.$emit("itemImageLoad");
    },
    itemClick() {
      console.log("跳转到详情页");
      this.$router.push("/detail" + this.goodsItem.iid);
    },
  },
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 44px;
  position: relative;
  width: 45%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
  /* border: 3px solid var(--color-tint); */
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: red;
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}
/* ::before伪类 */
.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("../../../assets/images/common/collect.svg") 0 0/14px 14px;
}
</style>