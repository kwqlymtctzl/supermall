<template>

  <div v-if="Object.keys(commentInfo).length !== 0" class="comment-info">

    <div class="info-header">
      <div class="header-title">用户评价</div>
      <div class="header-more">
        <!-- 这个更多应该有个@click监听跳转评论的页面，像淘宝那样 -->
        更多
        <i class="arrow-right"></i>
      </div>
    </div>

    <div class="info-user">
      <!-- 用户头像 -->
      <img :src="commentInfo.user.avatar" alt="">
      <!-- 用户名字 -->
      <span>{{ commentInfo.user.uname}}</span>
    </div>

    <div class="info-detail">
      <!-- 用户的评价内容 -->
      <p>{{ commentInfo.content }}</p>
      <div class="info-other">
        <!-- 用户评论的时间，后台给的数据是秒，Vue3不能用过滤器了，用计算属性 -->
        <span class="date">{{ commentInfo.created | showDate}}</span>
        <!-- 用户评论的商品样式 -->
        <span>{{commentInfo.style}}</span>
      </div>
      <div class="info-imgs ">
        <!-- 买家秀图片 -->
        <img :src="item" v-for="(item,index) in commentInfo.images" :key="index">
      </div>
    </div>

  </div>
</template>

<script>
import { formatDate } from "common/utils.js";

export default {
  name: "DetailCommentInfo",
  filters: {
    showDate(value) {
      let date = new Date(value * 100); //这里需要ms,value是s
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  props: {
    commentInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style scoped>
.comment-info {
  padding: 3px 12px;
  color: #333;
  border-bottom: 5px solid #f2f5f8;
}

.info-header {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
}

.header-title {
  float: left;
  font-size: 15px;
}

.header-more {
  float: right;
  margin-right: 10px;
  font-size: 13px;
}

.info-user {
  padding: 10px 0 5px;
}

.info-user img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

.info-user span {
  position: relative;
  font-size: 15px;
  top: -15px;
  margin-left: 10px;
}

.info-detail {
  padding: 0 5px 15px;
}

.info-detail p {
  font-size: 14px;
  color: #777;
  line-height: 1.5;
}

.info-detail .info-other {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.info-other .date {
  margin-right: 8px;
}

.info-imgs {
  margin-top: 10px;
}

.imfo-imgs img {
  width: 70px;
  height: 70px;
  margin-right: 5px;
}
</style>
