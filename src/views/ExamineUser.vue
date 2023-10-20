<script>
import {store} from "@/store";

export default {
  data() {
    return {
      store,
      params:{}
    }
  },
  methods: {
    init() {
      let that = this
      if (that.store.isLogin === false) {
        that.$router.push("/login")
      }
      that.userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
      console.log("session用户信息>>：" + that.userInfo)
    },

    onClickLeft(){
      this.$router.go(-1)
    },

    examinePasswd(){
      this.$router.push('/examinePasswd')
    },

    toLosePW() {
      this.$router.push({path: "/losepw", query: {userName: this.userInfo.userName}})
    },

  },
  mounted() {
    this.init()
  }
}
</script>

<template>
  <van-nav-bar
      title="身份验证"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
  />

  <div class="safe-picture"><img src="../assets/pictures/safe.png"></div>
  <div class="tip-title-div">身份验证</div>
  <div class="tip-word-div">为了保护您的账号安全，平台需要验证您的身份，验证通过后即可修改密码。</div>

  <van-cell-group class="safe-cell" inset >
    <van-cell icon="warning-o" title="原密码验证" title-style="margin-left:15px" is-link @click="examinePasswd">
    </van-cell>
  </van-cell-group>

  <van-cell-group class="passwd-cell" inset >
    <van-cell icon="question-o" title="忘记密码" title-style="margin-left:15px" is-link @click="toLosePW"/>
  </van-cell-group>

</template>

<style>

.tip-title-div{
  font-size: 20px;
  position: relative;
  top:80px;
}

.tip-word-div{
  font-size: 15px;
  color: #b8b6b6;
  position: relative;
  top:98px;
  width:80%;
  margin: auto;
}

.safe-picture img{
  position: relative;
  top:70px;
  width: 40%;
}

.safe-cell{
  --van-cell-background: rgba(225, 225, 231, 0.21);
  text-align: left;
  --van-cell-icon-size:28px;
  --van-cell-font-size:16px;
  position: relative;
  top: 138px;
  width: 90%;
  --van-cell-line-height: 40px;
  margin: auto;
}

.passwd-cell{
  --van-cell-background: rgba(225, 225, 231, 0.21);
  text-align: left;
  position: relative;
  top: 158px;
  width:90%;
  --van-cell-icon-size:28px;
  --van-cell-font-size:16px;
  --van-cell-line-height: 40px;
  margin: auto;
}


</style>