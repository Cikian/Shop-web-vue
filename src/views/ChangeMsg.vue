<script>
import {store} from "@/store";
import axios from "axios"
import {ref} from "vue";
import {showFailToast, showLoadingToast, showSuccessToast} from "vant";

const columns = [{
  text: '你的生日是',
  value: 'birthday'
},
  {
    text: '你的宠物的名字',
    value: 'petName'
  },
  {
    text: '你父亲或母亲姓名',
    value: 'parentName'
  },
  {
    text: '你小学学校名字',
    value: 'school'
  },
  {
    text: '你高中学校名字',
    value: 'highSchool'
  },
];
const showPicker = ref(false)
const pickQuestion = ref('');
const question = ref('');
const onConfirm = ({selectedOptions}) => {
  showPicker.value = false;
  question.value = selectedOptions[0].text;
};


export default {
  data() {
    return {
      store,
      showPicker,
      question,
      userInfo: {
        password:"",
        userName: "",
        avatar: "https://img.cikian.cn/mypic/cikian.jpg",
        nickName: "",
        phone: "",
        email: "",
        question: "",
        answer:""
      },
      changeInfo: {
        changeNick: "",
        changeEmail: "",
        changePhone: "",
        changeQuestion: "",   //更改密保问题弹窗
        changeAnswer:"",  //更改密保答案输入
        newAnswer:"",   //更改后的密保答案
      },
      checkAnswer:"",
      checkPasswd:"",
      nickNameShow: false,
      emailShow: false,
      phoneShow: false,
      questionShow: false,
      testPasswdShow:false,
      count: 0,
      changeQuestionShow:false,
      textPassword:"",
      pickQuestion:"",
      columns,
      onConfirm,
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push("/my")
    },
    init() {
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    },
    popShow() {
      this.changeInfo.changeNick=''
      this.nickNameShow = true
    },
    nickNameCancel(){
      this.changeInfo.changeNick=""
      this.nickNameShow = false
    },
    emailCancel(){
      this.changeInfo.changeEmail=""
      this.emailShow=false
    },
    phoneCancel(){
      this.changeInfo.changePhone=""
      this.phoneShow=false
    },
    questionCancel(){
      this.changeInfo.changeQuestion=""
      this.questionShow=false
    },
    changeQuestionCancel(){
      this.changeQuestionShow=false
    },
    testPasswdCancel(){
      this.checkPasswd=""
      this.testPasswdShow=false
    },
    saveNick() {
      this.userInfo.nickName = this.changeInfo.changeNick
      this.nickNameShow=false
    },
    saveEmail() {
      this.userInfo.email = this.changeInfo.changeEmail
      this.emailShow=false
    },
    savePhone() {
      this.userInfo.phone = this.changeInfo.changePhone
      this.phoneShow=false
    },
    handler() {
    },
    saveQuestion(){
      this.userInfo.question=question
      this.userInfo.answer=this.changeInfo.newAnswer
      console.log(JSON.stringify(this.userInfo))
      this.changeQuestionShow=false

    },
    saveAll(){
      showLoadingToast({
        forbidClick: true,
      });
      setTimeout(() => {
        axios.put("/user/update",this.userInfo).then((res)=>{
          if(res.data.code===4001){
            showSuccessToast(res.data.msg)
            this.store.userInfo=res.data.data
            sessionStorage.setItem("userInfo", JSON.stringify(res.data.data))
            console.log("修改后的用户信息："+JSON.stringify(this.store.userInfo))
          }else{
            showFailToast(res.data.msg)
          }
        })
      }, 1000)
      setTimeout(() => {
        this.$router.push("/my")
      }, 2000);
    },
    testAnswer(){
      if(this.userInfo.answer===this.checkAnswer){
        showSuccessToast("答案正确")
        this.checkAnswer=""
        this.changeQuestionShow=true
        this.questionShow=false
      }else {
        this.checkAnswer=""
        showFailToast("答案错误")
      }
    },
    testPasswd(){
      axios.post('/user/checkPasswd', this.checkPasswd, {
        headers: {
          'Content-Type': 'text/plain'
        }
      }).then((res)=>{
        console.log("传入的密码："+ this.checkPasswd)
        if(res.data.code===1001){
          this.changeQuestionShow=true
          this.testPasswdShow=false
        }else{
          showFailToast(res.data.msg)
        }
      })
    },
    changeMethod(){
      this.testPasswdShow=true
      this.questionShow=false
    },

  },
  mounted() {
    this.init()
  },
  computed: {
    countCharacters() {
      // 获取changeNick的长度
      let str = this.changeInfo.changeNick
      this.count = str.length
    }
  }
  ,
}


</script>

<template>
  <van-nav-bar class="bar"
               title="编辑资料"
               left-text="返回"
               right-text="保存"
               left-arrow
               @click-left="onClickLeft"
               @click-right="saveAll"
  />

  <div class="img">
    <van-image
        round
        width="6rem"
        height="6rem"
        :src="userInfo.avatar"
    />
  </div>
  <van-cell-group style="text-align: left">
    <van-cell title="昵称" is-link @click="popShow">{{ userInfo.nickName }}</van-cell>
    <van-cell title="邮箱" is-link @click="emailShow=true">{{ userInfo.email }}</van-cell>
    <van-cell title="电话" is-link @click="phoneShow=true">{{ userInfo.phone }}</van-cell>
    <van-cell title="密保问题" is-link @click="questionShow=true">{{ userInfo.question }}</van-cell>
  </van-cell-group>

  <van-popup v-model:show="nickNameShow" position="bottom" :style="{ height: '100%' }">
    <van-nav-bar title="编辑昵称"
                 left-text="取消"
                 right-text="保存"
                 left-arrow
                 @click-left="nickNameCancel"
                 @click-right="saveNick">
    </van-nav-bar>
    <van-cell-group inset border class="nick-field">
      <div class="custom-field">
        <van-field
            type="text"
            @blur="handler"
            v-model="changeInfo.changeNick"
            required
            :maxlength=16
            @input="countCharacters"
        >
        </van-field>
        <div class="word-limit">{{ count }}/16</div>
      </div>

    </van-cell-group>
    <div style="color: rgba(128,128,128,0.85);text-align: left;font-size: 14px;margin-left: 20px;margin-top: 20px">
      请输入不超过16个字符
    </div>
  </van-popup>


  <van-popup v-model:show="emailShow" position="bottom" :style="{ height: '100%' }">
    <van-nav-bar title="编辑邮箱"
                 left-text="取消"
                 right-text="保存"
                 left-arrow
                 @click-left="emailCancel"
                 @click-right="saveEmail">
    </van-nav-bar>
      <van-cell-group inset border class="email-field">
        <van-field
            type="text"
            v-model="changeInfo.changeEmail"
            required
            :rule="[{pattern:/^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/}]"
        ></van-field>
      </van-cell-group>
    <div style="color: rgba(128,128,128,0.85);text-align: left;font-size: 14px;margin-left: 20px;margin-top: 20px">
      请输入正确邮箱格式
    </div>
  </van-popup>


  <van-popup v-model:show="phoneShow" position="bottom" :style="{ height: '100%' }">
    <van-nav-bar title="编辑电话"
                 left-text="取消"
                 right-text="保存"
                 left-arrow
                 @click-left="phoneCancel"
                 @click-right="savePhone">
    </van-nav-bar>
      <van-cell-group inset border class="phone-field">
        <van-field
            type="text"
            :rules="[{patterm:/^1[3|4|5|6|7|8|9][0-9]\d{8}$/}]"
            v-model="changeInfo.changePhone"
            required
            :value="changeInfo.changePhone"
        ></van-field>
      </van-cell-group>
    <div style="color: rgba(128,128,128,0.85);text-align: left;font-size: 14px;margin-left: 20px;margin-top: 20px">
      请输入正确手机号码格式
    </div>
  </van-popup>



  <van-popup v-model:show="questionShow" position="bottom" :style="{ height: '40%' }">
    <van-nav-bar
                 left-text="取消"
                 right-text="确定"
                 left-arrow
                 @click-left="questionCancel"
                 @click-right="testAnswer">
    </van-nav-bar>


    <div class="question"><p>请验证密保问题：</p>{{userInfo.question}}</div>

    <van-cell-group inset class="answer-field">
      <van-field
        v-model="checkAnswer"
      ></van-field>
    </van-cell-group>

    <a @click="changeMethod">使用密码验证</a>
  </van-popup>

<!--  密码验证-->
    <van-popup v-model:show="testPasswdShow" position="bottom" :style="{ height: '40%' }">
      <van-nav-bar
          left-text="取消"
          title="请输入密码"
          right-text="确定"
          left-arrow
          @click-left="testPasswdCancel"
          @click-right="testPasswd">
      </van-nav-bar>

      <van-cell-group inset class="passwd-field">
        <van-field
          v-model="checkPasswd"
        ></van-field>
      </van-cell-group>
    </van-popup>

    <van-popup v-model:show="changeQuestionShow" position="bottom" :style="{ height: '40%' }">
      <van-nav-bar
          left-text="取消"
          right-text="确定"
          left-arrow
          @click-left="changeQuestionCancel"
          @click-right="saveQuestion">
      </van-nav-bar>
      <van-field
          v-model="question"
          is-link
          readonly
          label="密保问题"
          placeholder="选择密保问题"
          @click="showPicker = true"
      />

      <van-field
          v-model="changeInfo.newAnswer"
          label="密保答案"
      >
      </van-field>
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
            :columns="columns"
            @cancel="showPicker = false"
            ref="pickerRef"
            @confirm="onConfirm"
        />
      </van-popup>

    </van-popup>

</template>

<style scoped>
#app {
  --van-nav-bar-title-font-size: 18px;
  --van-button-primary-border-color:rgba(91, 94, 98, 0.96);
}

.img {
  margin: 40px auto;
}

.nick-field, .email-field, .phone-field {
  border: 1px rgba(0, 0, 0, 0.61) solid;
}

.word-limit {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
  margin-right: 10px;
  flex-shrink: 0;
}

.custom-field {
  display: flex;
  align-items: center;
}

.question{
  text-align: center;
  font-size:20px;
  letter-spacing: 4px;
  margin: 20px auto 20px;
  font-family: YouYuan;
}

.question p{
  color: #b8b6b6;
  letter-spacing: 0;
  font-size: 16px;
  margin-bottom: 10px;
}

.answer-field,.passwd-field{
  border: 1px rgba(0, 0, 0, 0.61) solid;
}
</style>