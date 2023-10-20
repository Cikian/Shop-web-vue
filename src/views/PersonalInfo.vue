
<template>
  <van-nav-bar class="bar"
               title="个人信息"
               left-text="返回"
               left-arrow
               @click-left="onClickLeft"
  />
  <br/>

<div class="img">
  <van-image
      round
      width="6rem"
      height="6rem"
      :src="userInfo.avatar"
  />

</div>


  <van-cell-group style="text-align: left">
    <van-cell title="用户名" :value=userInfo.userName />
    <van-cell title="昵称" :value=userInfo.nickName />
    <van-cell title="电话" :value=userInfo.phone />
    <van-cell title="邮箱" :value=userInfo.email />
    <van-cell title="密保问题" :value=userInfo.question />
  </van-cell-group>
</template>

<script>

export default {
  data() {
    return {
      userInfo: {
        userName: "",
        avatar: "https://img.cikian.cn/mypic/cikian.jpg",
        nickName: "",
        phone: "",
        email: "",
        question:""
      },
    }

  },
  mounted() {
    this.init()
  },
  methods: {
    onClickLeft() {
      this.$router.push("/my")
    },
    init() {
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
      console.log("session用户信息>>：" + this.userInfo.avatar)
    }
  },

}
</script>

<style>
#app {
  --van-button-primary-border-color:rgb(34,148,83);
  //--van-button-default-color:rgb(34,148,83);
  --van-nav-bar-title-font-size: 18px;

}

.bar {
  font-family: YouYuan;
}

.img{
  margin:20px auto 40px;
}

</style>