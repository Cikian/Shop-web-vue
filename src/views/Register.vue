<template>
  <van-nav-bar class="nav"
               title="用户注册"
               left-text="返回"
               left-arrow
               @click-left="onClickLeft"
  />
  <div class="van-hairline--surround">

    <van-uploader v-model="fileList"
                  max-count="1"
                  style="margin-top: 45px"
                  :before-read="beforeRead"
                  :after-read="afterRead"
                  class="uploader"
                  ref="file"
                  :preview-full-image="false"
                  accept="image/*"
    />


    <!-- 可以使用 CellGroup 作为容器 -->
    <div class="register_form">
      <van-form>
        <van-cell-group inset>
          <van-field v-model="params.userName"
                     label="用户名"
                     left-icon="user-circle-o"
                     placeholder="请输入用户名"
                     :rules="[{ required: true, message: '请填写用户名' },{pattern: /^[a-zA-Z0-9_-]{6,16}$/, message: '用户名为长度在6-16位的字母数字组合，且不能包含特殊符号'}]"
          ></van-field>
          <van-field v-model="params.nickName"
                     label="昵称"
                     left-icon="user-circle-o"
                     placeholder="请输入昵称，最大长度为16个字符"
          />
          <van-field v-model="params.password"
                     clearable
                     label="密码"
                     left-icon="eye-o"
                     type="password"
                     :rules="[{ required: true, message: '请填写密码'}]"
                     placeholder="请输入密码"/>
          <van-field v-model="params.password2"
                     clearable
                     label="确认密码"
                     left-icon="eye-o"
                     placeholder="请再输入一遍密码"
                     type="password"
                     :rules="[{ required: true, message: '请再次填写密码' }]"
                     @change="change"/>
          <van-field v-model="params.email"
                     clearable label="邮箱"
                     left-icon="envelop-o"
                     type="email"
                     placeholder="请输入邮箱"
                      :rules="[{ required: true, message: '请填写邮箱' },{pattern: /^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/, message: '邮箱格式不正确'}]"
          />
          <van-field v-model="params.phone"
                     type="tel"
                     clearable
                     label="电话号码"
                     left-icon="phone-o"
                     placeholder="请输入正确11位电话号码"
                      :rules="[{ required: true, message: '请填写电话号码' },{pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确'}]"
          />

        <!--      <van-field v-model="sms" center clearable left-icon="comment-o" label="短信验证码" placeholder="请输入短信验证码">-->
        <!--        <template #button>-->
        <!--          <van-button size="small" type="primary">发送验证码</van-button>-->
        <!--        </template>-->
        <!--      </van-field>-->

          <van-field v-model="question"
                     is-link
                     readonly
                     name="picker"
                     clearable
                     label="密保问题"
                     left-icon="warn-o"
                     placeholder="请点击选择问题"
                     @click="showPicker = true"/>
          <van-field v-model="params.answer"
                     clearablelabel="问题答案"
                     label="密保答案"
                     left-icon="edit"
                     placeholder="请输入问题答案"
                      :rules="[{ required: true, message: '请填写问题答案' }]"
          />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-picker :columns="columns"
                        ref="pickerRef"
                        @confirm="onConfirm"
                        @cancel="showPicker=false"
            />
          </van-popup>
        </van-cell-group>
      </van-form>
    </div>

    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit" @click="submit" color="rgba(34,148,83,0.67)">
        注册
      </van-button>
    </div>


  </div>
</template>

<script>
import {store} from "@/store";
import axios from "axios"
import {ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
// const onCancel = () => showToast('取消');
// const onChange = ({ selectedOptions }) => {
//   showToast(`当前值: ${selectedOptions.join(',')}`);
// };


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
const question = ref('');


const onConfirm = ({selectedOptions}) => {
  showPicker.value = false;
  question.value = selectedOptions[0].text;
};

//头像


export default {
  name: 'App',
  data() {

    return {
      // 文件上传用
      fileList: [],//默认是一个空数组
      imageData: {},
      isShow: false,
      showList: false,


      params: {
        userName: '',
        avatar: '',
        nickName: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        question: '',
        answer: ''
      },


      store,
      columns,
      onConfirm,
      question,
      showPicker,
    }
  },
  mounted() {

  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    submit() {
      let that = this
      this.params.question = question
      axios.post("/user/register", this.params).then((res) => {
        console.log(res)
        if (res.data.code === 3001) {
          this.store.userInfo = res.data.data
          // sessionStorage.setItem("userInfo",JSON.stringify(res.data.data))
          showSuccessToast(res.data.msg)
          // console.log("session存："+JSON.stringify(res.data.data))
          // this.store.isLogin=true
          // 两秒后跳转到首页
          setTimeout(function () {
            console.log("跳转")
            that.$router.push("/login")
          }, 2000)
        } else {
          showFailToast(res.data.msg)
        }
      })
      console.log(this.params)
    },
    change() {
      if (this.params.password !== this.params.password2) {
        showFailToast("两次密码不一致")
      }
    },
    beforeRead(file) {
      // 仅支持jpg，png，gif格式的图片
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isGIF = file.type === 'image/gif';

      console.log("图片类型：" + file.type)
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG && !isPNG && !isGIF) {
        showFailToast('上传头像图片只能是 JPG/PNG/GIF 格式!');
      }
      if (!isLt1M) {
        showFailToast('上传头像图片大小不能超过 1MB!');
      }
      return isLt1M;
    },
    afterRead(file) {
      let that = this
      // 此时可以自行将文件上传至服务器
      console.log(file);

      //在这块创建FormData对象
      // FormData 对象的使用：
      // 1.用一些键值对来模拟一系列表单控件：即把form中所有表单元素的name与value组装成一个queryString
      // 2. 异步上传二进制文件。
      //上传图片需要转换二进制这里要用到FormData
      const forms = new FormData();
      //这里的file表示给后台传的属性名字，这里看接口文档需要传的的属性
      forms.append("file", file.file); // 获取上传图片信息

      //向后端发送相应的请求
      //这块的url是具体的交互接口
      //headers是上传图片需要用到的响应头，此处的token是后端那边给设置的，所以我请求的时候需要带上token，
      //token根据实际情况自行添加
      axios.post("/user/upload", forms, '', {
        headers: {
          "content-type": "multipart/form-data",
        },
      }).then((res) => {
        //如果传入的响应状态码为200，则成功将文件发送给后台
        if (res.data.code === 1001) {
          console.log("上传成功!!!!!!!!!!!!!!!!!!!")
          console.log(res);
          that.params.avatar = res.data.data.filePath
          console.log(">>>>>>>头像地址：" + that.params.avatar)
          //this.imageData = res.data.showapi_res_body;
          //this.isShow = false;
          //this.showList = true;
          //Toast(res.data.showapi_res_body.remark);
        } else {
          //Toast(res.data.msg);
          //this.isShow = false;
          showFailToast(res.data.msg)//这块是请求失败后台给返回的相应的数据
        }
      });
    },

    // onConfirm(columns) {
    //   this.params.question = this.$refs.pickerRef.title;
    //   this.showPicker = false;
    //
    //   //   columns[0].text
    // },
  },
  components: {},
}
</script>
<style>
#app {
  font-family: PublicSans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
//margin-top: 60px;
}

.title {
  color: burlywood;
}

.register_form {
  margin: 20px auto;
}
</style>