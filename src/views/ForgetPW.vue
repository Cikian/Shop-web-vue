<template>

  <van-nav-bar class="nav"
      title="找回密码"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
  />

  <van-form @submit="onSubmit" v-if="!isPass">
    <van-cell-group inset>
      <van-field style="width: 350px; margin: 30px auto 5px;"
          v-model="userName"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
    </van-cell-group>

    <div style="margin: 16px; ">
      <van-button round block type="primary" native-type="submit" color="rgba(34,148,83,0.67)">
        下一步
      </van-button>
    </div>
  </van-form>

  <van-form @submit="upPasswd" v-else>
    <van-cell-group inset>
      <van-field v-model="question" label="密保问题" disabled/>
      <van-field v-model="answer" label="密保答案" :rules="[{ required: true, message: '请填写回答' }]"/>
      <van-field type="password" v-model="newPasswd" label="新密码" placeholder="请输入新密码"
                 :rules="[{ required: true, message: '请填写新密码' }]"/>
      <van-field type="password" v-model="reNewPasswd" label="新密码" placeholder="请再次输入新密码"
                 :rules="[{ required: true, message: '请再次填写新密码' }]"/>
    </van-cell-group>

    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit" color="rgba(34,148,83,0.67)">
        下一步
      </van-button>
    </div>
  </van-form>

  <!--  <van-form @submit="onSubmit2" v-if="isPass">-->
  <!--    <van-cell-group>-->
  <!--      <van-field label="密保问题" v-bind="question" readonly/>-->
  <!--      <van-field label="密保答案" v-model="answer" placeholder="请输入密保答案"/>-->
  <!--    </van-cell-group>-->
  <!--  </van-form>-->

</template>


<script>
import {store} from "@/store";
import axios from "axios";
import {showFailToast, showSuccessToast} from "vant";


export default {
  data() {
    return {
      store,
      isPass: false,
      question: "",
      answer: "",
      newPasswd: "",
      reNewPasswd: "",
      userInfo: {},
      userName: "",
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onSubmit() {
      axios.get("/user/forgetPasswd/" + this.userName).then((res) => {
        if (res.data.code === 2001) {
          this.userInfo = res.data.data
          this.question = res.data.data.question
          console.log(">>>>>>>>>>>>>>>>" + this.question)
          this.isPass = true
        } else {
          showFailToast(res.data.msg)
        }
      })

      // this.$router.push({path: "/losepw", query: {userName: this.userName}})

    },
    upPasswd() {
      let that = this
      if (this.newPasswd !== this.reNewPasswd) {
        showFailToast("两次密码不一致")
        return
      }
      let params = {
        userId: this.userInfo.userId,
        question: this.question,
        answer: this.answer,
        newPasswd: this.newPasswd,
        userName: this.userName,
      }
      axios.put("/user/forgetPasswd", params).then((res) => {
        if (res.data.code === 4001) {
          showSuccessToast(res.data.msg)
          setTimeout(function () {
            that.$router.push("/login")
          }, 2000)
        } else {
          showFailToast(res.data.msg)
        }
      })
    },

  },
  components: {},
  mounted() {
    this.userName = this.$route.query.userName;
  },

}
</script>


<style>
#app {
  --van-button-normal-font-size: 16px;
  --van-nav-bar-height: 60px;
//--van-button-normal-font-family: ;
}




.nav {

  box-shadow: 0 1px 10px 0 rgba(21, 35, 27, 0.1);
}

*{
  font-family: PublicSans;
}
</style>