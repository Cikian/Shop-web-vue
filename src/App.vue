<template>
  <van-nav-bar :border=false class="head_nave" title="鸟&nbsp;&nbsp巢&nbsp&nbsp市&nbsp&nbsp场" v-if="!$route.meta.notShowNav" fixed placeholder/>

  <router-view/>

  <van-tabbar v-model="active" route v-if="!$route.meta.notShowBar" active-color="#000000" inactive-color="rgba(103, 103, 103, 0.81)" :placeholder="true">
    <van-tabbar-item name="home" icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="bag-o" :dot=false to="/cate">分类</van-tabbar-item>
    <van-tabbar-item icon="shopping-cart-o" :badge="store.cartCount" to="/cart" v-if="store.isLogin">购物车</van-tabbar-item>
    <van-tabbar-item icon="user-circle-o" to="/login" v-else>购物车</van-tabbar-item>
    <van-tabbar-item icon="user-circle-o" to="/my" v-if="store.isLogin">我的</van-tabbar-item>
    <van-tabbar-item icon="user-circle-o" to="/login" v-else>我的</van-tabbar-item>
  </van-tabbar>

  <van-back-top style="--van-back-top-background:#000;" bottom="55" />
</template>

<script>
import {store} from "@/store";
import axios from "axios";
import {showConfirmDialog} from "vant";

export default {
  data() {
    return {
      active: 'home',
      store,
    };
  },
  methods: {
    init(){
      axios.get("/cart/count").then((res) => {
        console.log(res)
        if (res.data.code === 2001) {
          this.store.cartCount = res.data.data;
          console.log("获取购物车数量成功:" + this.store.cartCount)
        } else {
          console.log("获取购物车数量失败")
        }
      })
    }
  },
  mounted() {
    console.log(' ')
    console.log(' ')
    console.log(' ')
    console.log('------------------------------------------------------')
    console.log(' ________   ___   ___  __     ___   ________   ________')
    console.log('|\\   ____\\ |\\  \\ |\\  \\|\\  \\  |\\  \\ |\\   __  \\ |\\   ___  \\')
    console.log('\\ \\  \\___| \\ \\  \\\\ \\  \\/  /|_\\ \\  \\\\ \\  \\|\\  \\\\ \\  \\\\ \\  \\')
    console.log(' \\ \\  \\     \\ \\  \\\\ \\   ___  \\\\ \\  \\\\ \\   __  \\\\ \\  \\\\ \\  \\')
    console.log('  \\ \\  \\____ \\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\ \\  \\\\ \\  \\\\ \\  \\')
    console.log('   \\ \\_______\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\__\\ \\__\\\\ \\__\\\\ \\__\\')
    console.log('    \\|_______| \\|__| \\|__| \\|__| \\|__| \\|__|\\|__| \\|__| \\|__|')
    console.log('       Copyright @ Cikian  Power by Cikian  www.cikian.cn')
    console.log('------------------------------------------------------------')
    console.log(' ')
    console.log(' ')
    console.log(' ')


    var info = navigator.userAgent;
    //通过正则表达式的test方法判断是否包含“Mobile”字符串
    var isPhone = /mobile/i.test(info);
    //如果包含“Mobile”（是手机设备）则返回true
    if (!isPhone) {
      showConfirmDialog({
        title: '请使用移动端访问',
        message:
            '检测到您正在使用PC端浏览器访问本网站，为了确保您的体验，建议您使用移动端访问网站',
      }).then(() => {

      }).catch(() => {

      });
    }

      this.init()
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
  color: rgba(138, 138, 143, 0.51);
}

.van-nav-bar{
  //background: linear-gradient(to right, #fda085 0%, #f6d365 100%);
  background: linear-gradient(to right,  #c1dfc4 0%, #deecdd 40%,#deecdd 60%,#c1dfc4 100%);
  //background: #040404;
  --van-nav-bar-title-font-size:25px;
  --van-nav-bar-title-text-color:#fff;
}

.van-tabbar{
  background: linear-gradient(to right, #deecdd 0%, #c1dfc4 100%);
  --van-tabbar-item-active-background:linear-gradient(to right,#c1dfc4 0%, #deecdd 50%,#c1dfc4 100%);
}
</style>