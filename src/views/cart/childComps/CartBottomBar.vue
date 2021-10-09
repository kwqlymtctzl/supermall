<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" class="check-button" @click.native="checkClick"></check-button>
      <div>全选</div>
    </div>
    <div class='total'>
      <span class="totalPrice">合计：{{totalPrice}}</span>
      <div class="calculate" @click="calcClick">
        去计算：({{checkLength}})
      </div>
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton.vue";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed: {
    totalPrice() {
      return (
        "￥" +
        this.$store.state.shopList
          .filter(function (item) {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.$store.state.shopList.filter((item) => item.checked).length;
    },
    isSelectAll() {
      if (this.$store.state.shopList.length === 0) return false;
      //方法1：使用filter
      return !this.$store.state.shopList.filter((item) => !item.checked).length;
      //方法2：使用find
      //return !this.$store.state.shopList.find((item) => !item.checked)
      //方法3：普通遍历
      //   for (let item of this.$store.shopList) {
      //     if (!item.checked) {
      //       return false;
      //     }
      //   }
      //   return true;
    },
  },
  methods: {
    checkClick() {
      console.log("111");
      if (this.isSelectAll) {
        //上面isSelectAll计算属性就是用来有没有全部选上，全部选上就是true，部分没选上就是false
        this.$store.state.shopList.forEach((item) => (item.checked = false));
      } else {
        this.$store.state.shopList.forEach((item) => (item.checked = true));
      }
    },
    calcClick() {
      if (!this.$store.state.shopList.find((item) => item.checked)) {
        this.$toast.show("请选择购买的商品");
      }
    },
  },
};
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  display: flex;
  padding: 0 10px;
  bottom: 50px;
  left: 0;
  right: 0;
  width: 100%;
  height: 50px;
  align-items: center;
  border-top: 1px solid #ccc;
  background: #fff;
}
.check-content {
  display: flex;
  align-items: center;
  width: 80px;
  height: 40px;
}
.check-button {
  margin-right: 10px;
  height: 20px;
}
.total {
  display: flex;
  flex: 2;
  align-items: center;
  height: 40px;
}

.totalPrice {
  flex: 1;
  margin-left: 50px;
}

.calculate {
  height: 40px;
  width: 100px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  background: coral;
  border-radius: 20px;
}
</style>
