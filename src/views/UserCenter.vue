<template>
  <van-icon class="setting-icon"
            name="setting-o"
            size="25"
            @click="showRight=true">
  </van-icon>
  <van-popup
      v-model:show="showRight"
      position="right"
      :style="{ width: '70%', height: '100%' }"
  >
    <van-cell-group :border=false style="text-align: left">
      <van-cell
          @click="personalinfo"
          :border=false
          class="personalInfo"
          value="查看资料"
          icon="user-o"
          value-class="cellValue"
      ></van-cell>

      <van-cell
          @click="changemsg"
          class="chan_msg"
          value="编辑资料"
          icon="edit"
          :border=false
          value-class="cellValue"
      ></van-cell>

      <van-cell
          @click="addressList"
          :border=false
          class="edit-address"
          value="我的收货地址"
          icon="add-o"
          value-class="cellValue"
      ></van-cell>

      <van-cell
          @click="ordersList"
          :border=false
          class="allOrders"
          value="全部订单"
          icon="orders-o"
          value-class="cellValue"
      ></van-cell>

      <van-button
          round
          color="#8cc269"
          class="logout-button"
          type="small"
          plain
          block
          hairline
          @click="updatePasswd"
      >修改密码
      </van-button>
      <van-button
          round
          color="#8cc269"
          class="logout-button"
          v-if="store.isLogin"
          hairline
          block
          type="small"
          @click="logout">退出登录
      </van-button>
    </van-cell-group>
  </van-popup>
  <div>
    <van-image class="center-van-image"
               round
               width="80px"
               height="80px"
               :src='userInfo.avatar'
               fit="cover"
               @click="showBigAvatar = true"
    ></van-image>

    <van-overlay :show="showBigAvatar" @click="showBigAvatar = false">
      <div class="wrapper" @click.stop>
        <van-image class="center-van-image-pop"
                   round
                   width="80px"
                   height="80px"
                   :src='userInfo.avatar'
                   fit="cover"
                   @click="showBigAvatar = true"
        ></van-image>
        <van-uploader
            reupload
            v-model="fileList"
            :before-read="beforeRead"
            :after-read="afterRead"
            ref="file"
            :preview-image="false"
            accept="image/*"
            class="up-btn"
        >
          <van-button style="width: 50vw;" round color="rgba(0, 0, 0, 0.56)" hairline type="large">修改头像
          </van-button>
        </van-uploader>
      </div>
    </van-overlay>


  </div>
  <div class="names">
    <div class="nickname">{{ userInfo.nickName }}</div>
    <br/>
    <div class="username">用户名：{{ userInfo.userName }}</div>
  </div>

  <div class="icon_card">
    <van-grid class="cen_icon" :column-num="4" square icon-size="35" gutter="5" :border="false">
      <van-grid-item icon="paid" text="未付款" @click="unPaidOrders"/>
      <van-grid-item icon="other-pay" text="待发货" @click="unShippedOrders"/>
      <van-grid-item icon="logistics" text="已发货" @click="shippedOrders"/>
      <van-grid-item icon="gift-card-o" text="已收货" @click="receivedOrders"/>
    </van-grid>
  </div>

  <div class="new_tip">最新订单</div>

  <div class="order_new" v-if="newOrderView.title!==''">
    <div class="order_img">
      <van-image fit="cover" radius=5 :src="newOrderView.image" @click="toDetail"></van-image>
    </div>
    <div class="order_name">
      <van-text-ellipsis rows="2" :content="newOrderView.title"/>
    </div>

    <van-button class="order_btn1" v-if="this.newOrderInfo.status===10" round plain hairline size="small"
                @click="toClose">
      取消订单
    </van-button>
    <van-button class="order_btn2" v-if="this.newOrderInfo.status===10" round plain hairline size="small"
                @click="toDetail">
      继续付款
    </van-button>

    <div class="cancel-div" v-if="this.newOrderInfo.status===0">订单已取消</div>
    <van-button class="order_btn1" v-if="this.newOrderInfo.status===0" round plain hairline size="small"
                @click="toDelete">
      删除订单
    </van-button>

    <van-button class="order_btn1" v-if="this.newOrderInfo.status===20" round plain hairline size="small"
                @click="toDetail">
      查看订单
    </van-button>
  </div>
  <div v-else-if="newOrderView.title===''">
    <van-divider>您还没有订单，快去下单吧</van-divider>
  </div>


</template>

<script>


import {store} from "@/store";
import axios from "axios";
import {Icon, showConfirmDialog, showFailToast, showSuccessToast} from 'vant';
import {Grid, GridItem, Dialog} from 'vant';
import {Image as VanImage} from 'vant';
import {createApp} from "vue";
import orderDetail from "@/views/OrderDetail.vue";
import 'vant/es/notify/style'
import 'vant/es/dialog/style'
import personalInfo from "@/views/PersonalInfo.vue";

const app = createApp();
app.use(Grid);
app.use(GridItem);
app.use(VanImage);
export default {
  computed: {
    orderDetail() {
      return orderDetail
    }
  },
  data() {

    return {
      // 文件上传用
      fileList: [],//默认是一个空数组
      imageData: {},
      isShow: false,
      showList: false,
      avatarUploadPath: "",


      userInfo: {
        userName: "",
        avatar: "https://img.cikian.cn/mypic/cikian.jpg",
        nickName: "",
      },
      newOrderInfo: {},
      newOrderView: {
        image: "",
        title: "",
      },
      newOrderItems: [],
      store,
      text: '',
      showRight: false,
      showBigAvatar: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let that = this
      if (that.store.isLogin === false) {
        that.$router.push("/login")
      }
      that.userInfo = that.store.userInfo
      that.userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
      console.log("session用户信息>>：" + JSON.stringify(that.userInfo))
      axios.get("/cart/count").then((res) => {
        console.log(res)
        if (res.data.code === 2001) {
          that.store.cartCount = res.data.data;
          console.log("获取购物车数量成功:" + that.store.cartCount)
        } else {
          console.log("获取购物车数量失败")
        }
      })
      // 获取最新订单执行完成后，将数据赋值给newOrderInfo，再继续执行axios.get("/order/items/" + that.newOrderInfo.orderId)
      axios.get("/order/new").then((res) => {
        console.log(res)
        if (res.data.code === 2001) {
          that.newOrderInfo = res.data.data;
          console.log("获取最新订单成功:" + JSON.stringify(that.newOrderInfo))
        } else {
          console.log("获取最新订单失败")
        }
      }).finally(() => {
        axios.get("/order/items/" + that.newOrderInfo.orderId).then((res) => {
          console.log(res)
          if (res.data.code === 2001) {
            that.newOrderItems = res.data.data;
            that.newOrderView.image = that.newOrderItems[0].mainImage
            that.newOrderView.title = that.newOrderItems[0].name + "等" + that.newOrderItems.length + "件商品"
            console.log("获取最新订单详情成功:" + JSON.stringify(that.newOrderItems))
          } else {
            console.log("获取最新订单详情失败：未登录")
          }
        })
      })
    },
    logout() {
      axios.get("/user/logout").then((res) => {
        console.log(res)
        if (res.data.code === 1001) {
          this.store.isLogin = false
          this.store.userInfo = {}
          this.userInfo = {}
          sessionStorage.removeItem("userInfo")
          this.$router.push("/")
        }
      })
    },
    personalinfo() {
      this.$router.push("/personalinfo")
    },
    changemsg() {
      this.$router.push("/changemsg")
    },
    addressList() {
      this.$router.push("/addressList")
    },
    toDetail() {
      console.log("跳转到订单详情页的id:" + this.newOrderInfo.orderId)
      this.$router.push({path: "/orderDetail", query: {orderId: this.newOrderInfo.orderId}})
    },
    toClose() {
      let that = this
      console.log("取消的订单详情页id:" + this.newOrderInfo.orderId)

      showConfirmDialog({
        title: '确认取消订单？',
        message:
            '小主不再考虑考虑吗',

      }).then(() => {
        axios.delete("/order/close", {params: {orderId: this.newOrderInfo.orderId}}).then((res) => {
          console.log(res)
          if (res.data.code === 4001) {
            showSuccessToast("取消订单成功")
            this.init()
          } else {
            showFailToast("取消订单失败")
          }
        })
      }).catch(() => {
        console.log("取消取消订单")
      });


    },
    toDelete() {
      let that = this;
      axios.delete("/order/" + this.newOrderInfo.orderId).then((res) => {
        if (res.data.code === 5001) {
          showSuccessToast(res.data.msg)
          that.init()
        } else {
          console.log(res)
          showFailToast(res.data.msg)
        }
      })
    },

    updatePasswd() {
      this.$router.push('/ExamineUser')
    },


    beforeRead(file) {
      // 仅支持jpg，png，gif格式的图片
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isGIF = file.type === 'image/gif';

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
          that.avatarUploadPath = res.data.data.filePath
          console.log("上传头像成功:" + that.avatarUploadPath)
          that.userInfo.avatar = that.avatarUploadPath
          that.store.userInfo = that.userInfo
          sessionStorage.setItem("userInfo", JSON.stringify(that.userInfo))
          console.log("提交的用户信息：" + JSON.stringify(that.userInfo))
          axios.put('/user/update', that.userInfo).then((res) => {
            if (res.data.code === 4001) {
              that.store.userInfo = that.userInfo
              // 刷新页面
            }
          })

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

    ordersList() {
      this.$router.push('/ordersList')
    },

    unPaidOrders() {
      this.$router.push('/unPaidOrders')
    },

    unShippedOrders() {
      this.$router.push('/unShippedOrders')
    },

    shippedOrders() {
      this.$router.push('/shippedOrders')
    },

    receivedOrders() {
      this.$router.push('/receivedOrders')
    }

  },
  components: {}
}


</script>

<style>
#app {
//--van-grid-item-icon-size:35px;
}


.center-van-image {
  margin-top: 20px;
  margin-left: 30px;
  float: left;
}

.nickname {
  font-family: PublicSans;
  font-weight: bold;
//border: 1px black solid; font-size: 18px; margin-top: 48px; margin-left: 20px;
}

.username {
  font-family: YouYuan;
//border: 1px black solid; font-weight: lighter; font-size: 13px; color: rgba(0, 0, 0, 0.51); line-height: 10px; margin-top: 0px; margin-left: 20px;
}

.names {
  position: relative;
  float: left;
  margin-right: 30px;
  text-align: left;
}

.cen_icon {
//font-family: YouYuan; padding-top: 30px; margin: auto; //border: 1px black solid; width: 350px;
}

.order_new {
  position: relative;
  width: 100%;
  height: auto;
}

.new_tip {
  margin-top: 10px;
  margin-left: 30px;
  font-family: PublicSans;
  letter-spacing: 3px;
  font-size: 13px;
  text-align: left;
  position: relative;
  top: 0;
  left: 0;
}


.order_img {
  width: 90px;
  box-shadow: 0 1px 3px 0 rgba(21, 35, 27, 0.1);
  height: 90px;
  position: absolute;
  left: 30px;
  top: 40px;
  border-radius: 5px;
}

.order_name {
//border: 1px black solid; text-align: left; width: 60%; position: absolute; top: 35px; left: 130px;
  font-size: 13px;
  font-family: PublicSans;
}

.order_btn1 {
  position: absolute;
  top: 100px;
  right: 20px;
}

.order_btn2 {
  position: absolute;
  top: 100px;
  right: 92px;
}


.personalInfo {

  margin-top: 60px;
  position: relative;
  float: left;
}

.cellValue {
  text-align: left;
}

.setting-icon {
//border: 1px black solid; position: relative; float: right; margin-right: 18px; margin-top: 15px;
}

.logout-button {
//border:#b8b6b6 solid 0.5px; width: 95%; margin: 10px auto 0px;
}

.cancel-div {
  position: absolute;
  font-size: 9px;
  right: 90px;
  top: 110px;
  color: #2e317c;
  letter-spacing: 1px;
  font-family: YouYuan;
}

@keyframes autoAnimation {
  0% {
    width: 80px;
    height: 80px;
    margin-top: 20px;
    margin-left: 30px;
    float: left;
  }
  100% {
    width: 80vw;
    height: 80vw;
    margin-top: 100px;
    margin-left: 10vw;
    float: left;
  }
}

.center-van-image-pop {
  width: 80px;
  height: 80px;
  margin-top: 20px;
  margin-left: 30px;
  float: left;
  animation: autoAnimation 0.3s ease-in-out;
  animation-fill-mode: forwards;
}

.up-btn {
  width: 50vw;
  position: fixed;
  left: 25vw;
  bottom: 200px;
}


</style>