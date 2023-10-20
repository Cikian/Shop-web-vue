<script>
import {store} from "@/store";
import axios from "axios";
import {showFailToast, showSuccessToast} from "vant";

export default {
  name: "ExaminePasswd",
  data() {
    return {
      params: {
        prePasswd:'',
        newPasswd:''
      },
      passwd:"",
      store,
      newPasswd:"",
      checked:false,
      isInput:false,
      userInfo:{}
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

    inputOnChange(){
      if(this.passwd!==''&&this.newPasswd!==''){
        this.isInput=true;
        console.log(this.isInput)
      }else {
        this.isInput=false;
      }
    },

    onSubmit(){
      this.params.prePasswd=this.passwd;
      this.params.newPasswd=this.newPasswd;
      console.log(this.params);
      axios.put("/user/updatePasswd", this.params).then((res) =>{
          if(res.data.code===4001){
            showSuccessToast(res.data.msg)
            this.$router.push('/login');
            console.log(this.userInfo)
          }else {
            showFailToast(res.data.msg)
          }
        })
    }

  },
  mounted() {
    this.init()
  }
}
</script>

<template>
  <van-nav-bar
      title=""
      left-text=""
      left-arrow
      @click-left="onClickLeft"
  />

  <div class="passwd">输入原密码验证并填写新密码</div>
<van-form>
  <van-cell-group :border=false @change="inputOnChange">
    <van-field class="password"
               v-model="passwd"
               type="password"
               label="原密码"
               :border=false
               :rules="[{required: true, message: '请填写原密码' }]" />

    <van-field class="newPasswd-field"
               v-model="newPasswd"
               type="password"
               label="新密码"
               :border=false
               :rules="[{required: true, message: '请填写新密码' }]" />
  </van-cell-group>
</van-form>

  <van-button class="submit-btn" block plain hairline color="#000" :disabled="!isInput" @click="onSubmit">提交</van-button>
</template>

<style>
.passwd{
  text-align: center;
  position: relative;
  top:20px;
  letter-spacing: 3px;
  font-family: YouYuan;
  width: 90%;
  margin: auto;
  font-size:20px;
}

.password{
  font-family: YouYuan;
  position: relative;
  top:50px;
  background: rgba(239, 239, 239, 0.32);
}

.newPasswd-field{
  font-family: YouYuan;
  position: relative;
  top:75px;
  background: rgba(239, 239, 239, 0.32);
}

.submit-btn{
  position: relative;
  top:115px;
  width: 85%;
  margin: auto;
  border-radius: 5px;
}
</style>