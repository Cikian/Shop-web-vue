<style>
#app {
  --van-button-normal-font-size: 16px;
  --van-nav-bar-text-color: rgb(34,150,83);
  --van-nav-bar-icon-color: rgb(34,150,83);
  --van-nav-bar-height: 60px;
  //--van-nav-bar-title-text-color:rgb(34,150,83);
//--van-button-normal-font-family: ;
}

a {
  color: rgba(34,148,83);
  font-size: 13px;
}

a:visited {
  color: rgb(34,148,83);
}

a:hover {
  color: rgb(34,148,83);
}

a:active {
  color: rgb(34,148,83);
}

a:link {
  color: rgba(34,148,83, 0.76);
}

.login_form {
  width: 350px;
//border: black solid 1px; margin: auto;
  margin-top: 30px;
  font-family: PublicSans;
}

.passwd {
  margin-top: 25px;
}

.tip {
//margin-top: 25px; width: 200px;
  margin: 45px auto;
}

.nav {
  box-shadow: 0 1px 10px 0 rgba(21, 35, 27, 0.1);
  font-family: YouYuan;
}


.avatar{
  margin-top: 30px;
}


</style>

<template>

  <div >
    <van-nav-bar class="nav"
                 title="鸟&nbsp;&nbsp巢&nbsp&nbsp市&nbsp&nbsp场"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft"
    />
  </div>
  <van-image class="avatar"
      round
      width="7rem"
      height="7rem"
      src="https://img-upyun.cikian.cn/develop/Shop-dev/partyparrot.gif"
  />
  <div class="login_form" >
    <van-form @submit="login">
      <van-cell-group inset>
        <van-field
            v-model="params.userName"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' },{pattern: /^[a-zA-Z0-9_-]{6,16}$/, message: '格式不正确'}]"
        ></van-field>
        <van-field class="passwd"
                   v-model="params.password"
                   type="password"
                   name="密码"
                   label="密码"
                   placeholder="密码"
                   :rules="[{required: true, message: '请填写密码' }]"
        ></van-field>

      </van-cell-group>
      <div style="font-family:PublicSans;margin: auto; margin-top: 25px; ">
        <van-button round block type="primary" native-type="submit" color="rgba(34,148,83,0.67)" :disabled="!checked">
          登 录
        </van-button>
      </div>
    </van-form>
  </div>
  <div class="tip" style="font-family: PublicSans;">
    <span><a @click="register">还没有账号？</a></span>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
    <span><a @click="toLosePW">忘记密码</a></span>
  </div>

  <div style="margin: 45px auto; width:fit-content; font-size: 13px;font-family: PublicSans;">
    <van-checkbox v-model="checked" checked-color="rgb(34,148,83)">我已阅读并同意《服务协议》和《隐私政策》
    </van-checkbox>
  </div>
</template>

<script>
import 'vant/es/toast/style'
import {createApp, ref} from 'vue';
import {Checkbox, CheckboxGroup, showFailToast, showSuccessToast, Toast} from "vant";
import axios from "axios";
import {store} from "@/store";
import { Image as VanImage } from 'vant';


const app = createApp();


app.use(Toast);
app.use(Checkbox);
app.use(CheckboxGroup);
app.use(VanImage);
export default {

  mounted() {
    this.init()
    console.log("是否登录：" + this.store.isLogin)
    console.log("用户信息：" + this.store.userInfo)
  },
  data() {
    return {
      checked: false,
      store,
      params: {}
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push("/")
    },
    // 页面数据初始化
    init() {
      console.log("页面数据初始化")
      axios.get("/user/currentUser").then((res) => {
        console.log("init:" + res)
        if (res.data.data != null) {
          this.store.userInfo = res.data.data
          this.store.isLogin = true
          sessionStorage.setItem("userInfo", JSON.stringify(res.data.data))
          console.log(sessionStorage.getItem("userInfo"))
          // 刷新后，重定向至“我的”
          this.$router.push("/my")
        }
      })
    },

    login() {
      let that = this
      axios.post("/user/", this.params).then((res) => {
        console.log(res)
        if (res.data.code === 6001) {
          this.store.userInfo = res.data.data
          sessionStorage.setItem("userInfo", JSON.stringify(res.data.data))
          showSuccessToast(res.data.msg)
          console.log("session存："+JSON.stringify(res.data.data))
          this.store.isLogin = true
          // 两秒后跳转到首页
          setTimeout(function () {
            that.$router.push("/")
          }, 2000)
        } else {
          showFailToast(res.data.msg)
        }
      })
    },

    toLosePW() {
      this.$router.push({path: "/losepw", query: {userName: this.params.userName}})
    },
    register(){
      this.$router.push({path:"/register"})
    }
  }
}
</script>