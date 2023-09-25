<template>
  <van-nav-bar title="鸟&nbsp;&nbsp巢&nbsp&nbsp市&nbsp&nbsp场" v-if="!$route.meta.notShowNav"/>

  <router-view/>

  <van-tabbar v-model="active" route v-if="!$route.meta.notShowBar" active-color="rgba(34,148,83, 0.76)">
    <van-tabbar-item name="home" icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="bag-o" :dot=false to="/about">标签</van-tabbar-item>
    <van-tabbar-item icon="shopping-cart-o" badge="5" to="/cart">购物车</van-tabbar-item>
    <van-tabbar-item icon="user-circle-o" to="/my" badge="20" v-if="store.isLogin">我的</van-tabbar-item>
    <van-tabbar-item icon="user-circle-o" to="/login" badge="20" v-else>我的</van-tabbar-item>

  </van-tabbar>

  <van-back-top bottom="55" />
</template>

<script>
import {store} from "@/store";

export default {
  data() {
    return {
      active: 'home',
      store
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  //--van-nav-bar-background:;
  --van-nav-bar-title-text-color:#000000;
  --van-nav-bar-title-font-size:20px;
  color: #2c3e50;
}

nav {
  padding: 30px;
}
.van-nav-bar{
  //background-color:rgba(157,170,108);

}
nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script setup>
</script>