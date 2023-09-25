<template>
  <div style="width: 100px;">
  <van-image class="center-van-image"
      round
      width="5rem"
      height="5rem"
      :src='userInfo.avatar'
      fit="cover"></van-image></div>
  <div class="names">
  <div class="nickname">{{userInfo.nickName}}</div>
  <br/>
  <div class="username">用户名：{{userInfo.userName}}</div>
  </div>

  


<!-- //个人信息
  <van-cell-group style="text-align: left">
    <van-cell title="用户名" :value=userInfo.userName />
    <van-cell title="昵称" :value=userInfo.nickName />
    <van-cell title="电话" :value=userInfo.phone />
    <van-cell title="邮箱" :value=userInfo.email />
  </van-cell-group>
-->
  <br/>
  <van-button v-if="store.isLogin" type="primary" @click="logout">退出登录</van-button>

</template>

<script>
import {store} from "@/store";
import axios from "axios";
import { Cell, CellGroup } from 'vant';


export default {
  data() {

    return {
      userInfo: {
        userName: "",
        avatar: "https://img.cikian.cn/mypic/cikian.jpg",
        nickName:"",
      },
      store
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

      if (this.store.isLogin === false) {
        this.$router.push("/login")
      }
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
      console.log("session用户信息>>：" + this.userInfo)
    },
    logout() {
      axios.get("/user/logout").then((res) => {
        console.log(res)
        if (res.data.code === 1001) {
          this.store.isLogin = false
          this.store.userInfo = {}
          this.userInfo = {}
          this.$router.push("/login")
        }
      })
    }
  },
  components: {}
}
</script>

<style>
#app{
}

.center-van-image{
  margin-top: 30px;
  margin-left: 30px;
  float: left;
}

.nickname{
  font-family: PublicSans;
  font-weight: bold;
  //border: 1px black solid;
  font-size: 18px;
  margin-top: 48px;
  margin-left: 20px;
}

.username{
  font-family: YouYuan;
  //border: 1px black solid;
  font-weight: lighter;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.51);
  line-height: 10px;
  margin-top: 0px;
  margin-left: 20px;
}

.names{
  position: relative;
  float: left;
  text-align: left;
}
</style>