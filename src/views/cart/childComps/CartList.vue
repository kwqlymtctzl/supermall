<template>
  <div>
    <cart-list-item v-for="(item,index) in $store.state.shopList" :key="index" :item-info="item"></cart-list-item>
  </div>
</template>

<script>
import CartListItem from "./CartListItem.vue";

export default {
  name: "CartList",
  components: {
    CartListItem,
  },
};
</script>

<style scoped>
</style>
