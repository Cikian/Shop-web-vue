<template>
  <van-nav-bar
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
  >
  </van-nav-bar>


  <div style="font-size: 23px;
              font-family: PublicSans;
              text-align: left;
              position: relative;
              width: 70%;
              z-index: 99;
              top:20px;
              left:20px;
              font-weight: bold;"
      v-if="this.order.status===10"><van-count-down style="font-size: 25px;color: #fa0202" :time="time" format="mm : ss" />
    <span style="position: absolute;z-index:99;top:-5px;left:80px;">后关闭订单</span></div>
  <div style="font-size: 23px;
              font-family: PublicSans;
              text-align: left;
              position: relative;
              width: 50%;
              z-index: 99;
              top:20px;
              left:20px;
              font-weight: bold;"
       v-else-if="this.order.status===0">订单已取消</div>
  <div style="font-size: 23px;
              font-family: PublicSans;
              text-align: left;
              position: relative;
              width: 50%;
              z-index: 99;
              top:20px;
              left:20px;
              font-weight: bold;"
      v-else-if="this.isPaid===true">已付款</div>

<!--  获取订单收货地址-->
      <div class="add-box" style="z-index: 99;position: relative;top:30px;">
        <van-cell style="text-align: left" icon="location-o" :title='this.shoppingInfo.receiverProvince+this.shoppingInfo.receiverCity+this.shoppingInfo.receiverDistrict+this.shoppingInfo.receiverAddress'>
          <template #label>
            <span style="text-align: left">{{this.shoppingInfo.receiverName}}</span>&nbsp;&nbsp;
            <span style="text-align: left">{{this.shoppingInfo.receiverPhone}}</span>
          </template>
        </van-cell>
      </div>

<!--  订单展示-->
  <van-card
      style="text-align: left;z-index: 99;position: relative;top:50px;"
      class="order-card"
      :num="p.count"
      :price="p.price"
      :title="p.name"
      :desc="p.subtitle"
      :thumb="p.mainImage"
      v-for="(p, index) in orderItems" :key="index"
  >
    <template #tags>
      <van-tag plain type="primary">七天无理由退货</van-tag>
    </template>
  </van-card>

  <van-cell-group style="text-align: left;z-index: 99;position: relative;top:70px;" :border=false >
    <van-cell
        :border=false
        title="配送服务"
        value="快递 免邮">
    </van-cell>
    <van-cell
        :border=false
        title="订单编号"
        :value="orderId"/>
    <van-cell
        title="支付宝交易号"
        :value="this.order.alipayNo"
        :border=false />
    <van-cell
        :border=false
        title="创建时间"
        :value="this.order.createTime"/>
    <van-cell
        :border=false
        title="付款时间"
        :value="this.order.paymentTime"
        v-if="isPaid===true"/>
  </van-cell-group>


  <van-action-bar v-if="this.order.status===10">
    <van-action-bar-button type="danger" text="继续付款" @click="onClickButton" />
  </van-action-bar>
</template>

<script>
import axios from "axios";
import {showFailToast, showSuccessToast} from "vant";
import ordersView from "@/views/OrdersView.vue";
import qs from "qs";

export default {
  computed: {
    ordersView() {
      return ordersView
    }
  },
  data() {
    return {
      chosenAddressId: '1',
      list: [],
      address: {},
      status: 0,
      isPaid: false,
      order: {},
      orderItems: [],
      orderId: '',
      time: 10 * 60 * 1000,
      shoppingInfo: {},

    };
  },

  mounted() {
    this.orderId = this.$route.query.orderId;
    console.log("订单id：" + this.orderId)
    this.loadData()
    this.loadItems()
  },

  methods: {
    loadData() {
      // 请求执行完成后，将数据赋值给order，再继续执行init方法
      let that = this;
      axios.get("/order/"+that.orderId).then((res) => {
        if (res.data.code === 2001) {
          that.order = res.data.data;
        } else {
          showFailToast(res.data.msg)
        }
      }).finally(() => {
        that.status = that.order.status;
        that.isPaid = that.order.status !== 10 && this.order.status !== 0;
        console.log("订单状态：" + that.order.status)
        console.log("订单是否已支付：" + that.isPaid)
        that.init()
      }, 1000)

      axios.get("/shopping/"+that.orderId).then((res) => {
        if (res.data.code === 2001) {
          that.shoppingInfo = res.data.data;
          console.log("获取订单收货地址成功:" + JSON.stringify(that.shoppingInfo))
        } else {
          showFailToast(res.data.msg)
        }
      })

    },


    init() {
      console.log("2获取订单信息成功:" + JSON.stringify(this.order))
      console.log("orderId:" + this.order.orderId)
      // 获取订单信息中的创建时间，然后转换为时间戳
      let createTime = this.order.createTime;
      console.log("订单创建时间：" + this.order.createTime)
      // 将2023-10-08 09:38:29字符串格式的时间转换为时间戳
      let createTimeStamp = new Date(createTime).getTime();
      console.log("订单创建时间戳：" + createTimeStamp)
      // 获取当前时间戳
      let nowTimeStamp = new Date().getTime();
      console.log("当前时间戳：" + nowTimeStamp)
      // 计算出剩余时间
      let leftTime = nowTimeStamp - createTimeStamp;
      console.log("剩余时间：" + leftTime)
      // 如果leftTime时大于10分钟，那么就不显示倒计时
      if (leftTime > 10 * 60 * 1000) {
        this.time = 0;
      } else {
        this.time = 10 * 60 * 1000 - leftTime;
      }
    },

    loadItems() {
      let that = this;
      axios.get("/order/items/"+this.orderId).then((res) => {
        if (res.data.code === 2001) {
          that.orderItems = res.data.data;
          console.log("1获取订单详情成功:" + JSON.stringify(this.orderItems))

        } else {
          showFailToast(res.data.msg)
        }
      })

    },

    onClickLeft(){
      this.$router.push('/ordersList')
    },

    onClickButton(){
      let that = this
      showSuccessToast("正在跳转支付页面")


      setTimeout(function () {
        axios.post('/alipay/pay', qs.stringify({
          orderNo: that.order.orderId,
          amount: that.order.payment
        }))
            .then(function (response) {
              // 处理成功情况
              document.querySelector("body").innerHTML = response.data; // 查找到当前页面的body，将后台返回的form替换掉他的内容
              document.forms[0].submit();
            })


        // 此处地址应为后台支付页面
        // window.open("http://shop.cikian.cn/alipay/pay?subject=" + "Cikian商城购买商品" + "&totalPrice=" + that.orderView.payment + "&traceNo=" + res.data.data)
      }, 2000)

    }
  },
}
</script>

<style>
.order-card{
  --van-card-background:#ffffff;
}

.van-card__num{
  position: absolute;
  right:10px;
  top:10px;
  font-size: 15px;
}

.van-card__price{
  position: absolute;
  right:10px;
  bottom:0px;
  font-size: 15px;
}
</style>