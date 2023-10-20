<script>
import {store} from "@/store";
import ordersView from "@/views/OrdersView.vue";
import axios from "axios";
import {showConfirmDialog, showFailToast, showSuccessToast} from "vant";
import {ref} from "vue";
import {route} from "vant/es/composables/use-route";
import data from "core-js/internals/array-iteration";


export default {
  computed: {},
  data() {
    return {
      store,
      status: 0,
      order: {},
      orderId: '',
      orderItems: [],
      ordersActive: 'unshipped',
      allOrders: [], // 所有订单
      unpaidOrders: [], // 待付款订单
      userInfo: {},
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

      axios.get('/order/unshipped/').then((res) => {
        if (res.data.code === 2001) {
          console.log(res)
          this.orderItems = res.data.data;
        }
      })
    },


    onClickLeft() {
      this.$router.go(-1)
    },

    toDetail(orderId) {
      console.log("跳转到订单详情页的id:" + orderId)
      this.$router.push({path: "/orderDetail", query: {orderId: orderId}})
    },

    onClickTab(title) {
      console.log(this.ordersActive)
      console.log("点击的tab标题：" + JSON.stringify(title))
      if (title.name === 'all') {
        axios.get("/order/myOrders/" + this.userInfo.userId).then((res) => {
          if (res.data.code === 2001) {
            console.log(res)
            this.orderItems = res.data.data;
          }
        })
      } else if (title.name === 'unpaid') {
        axios.get('/order/unpaid/').then((res) => {
          if (res.data.code === 2001) {
            console.log(res)
            this.orderItems = res.data.data;
          }
        })
      } else if (title.name === 'unshipped') {
        axios.get('/order/unshipped/').then((res) => {
          if (res.data.code === 2001) {
            console.log(res)
            this.orderItems = res.data.data;
          }
        })
      } else if (title.name === 'shipped') {
        axios.get('/order/shipped/').then((res) => {
          if (res.data.code === 2001) {
            console.log(res)
            this.orderItems = res.data.data;
          }
        })
      } else if (title.name === 'received') {
        axios.get('/order/received/').then((res) => {
          if (res.data.code === 2001) {
            console.log(res)
            this.orderItems = res.data.data;
          }
        })
      }
    },

    toClose(orderId) {
      console.log("取消的订单详情页id:" + this.orderId)

      showConfirmDialog({
        title: '确认取消订单？',
        message:
            '小主不再考虑考虑吗',

      }).then(() => {
        axios.delete("/order/close", {params: {orderId: orderId}}).then((res) => {
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

    toDelete(orderId) {
      let that = this;
      showConfirmDialog({
        title: '删除订单',
        message:
            '此操作不可恢复，确认删除订单？',
      }).then(() => {
        axios.delete("/order/" + orderId).then((res) => {
          if (res.data.code === 5001) {
            showSuccessToast(res.data.msg)
            that.init()
          } else {
            showFailToast(res.data.msg)
          }
        })
      }).catch(() => {
        console.log("取消")
      });
    },
  },
  mounted() {
    this.init();
    this.orderId = this.$route.query.orderId;
  },
}

</script>

<template>
  <van-nav-bar class="top-nav"
               placeholder
               fixed
               title="鸟巢市场"
               left-arrow
               @click-left="onClickLeft"
  />

  <van-tabs class="tab"
            v-model:active="ordersActive"
            sticky
            @click-tab="onClickTab"
            swipeable>
    <van-tab title="全部" name="all"></van-tab>
    <van-tab title="未付款" name="unpaid"></van-tab>
    <van-tab title="待发货" name="unshipped"></van-tab>
    <van-tab title="已发货" name="shipped"></van-tab>
    <van-tab title="已收货" name="received"></van-tab>
  </van-tabs>

  <!--  <van-card class="orders-list"-->
  <!--            :num="p.count"-->
  <!--            :price="p.price"-->
  <!--            :title="p.name"-->
  <!--            :desc="p.subtitle"-->
  <!--            :thumb="p.mainImage"-->
  <!--            v-for="(p, index) in orderItems" :key="index" />-->

  <div style="margin-top: 120px">
    <div class="ordersALL" v-for="(p, index) in orderItems" :key="index">
      <div style="background-color: red;margin-top: 100px;" v-if="p===''">您还没有订单，快去下单吧</div>
      <div v-else>
        <div class="list-img">
          <van-image fit="cover" radius=5 :src="p.image" @click="toDetail(p.orderId)"></van-image>
        </div>
        <div class="list-name">
          <van-text-ellipsis rows="2" :content="p.title+'等'+p.count+'件'"/>
        </div>
        <div class="list-price">
          <span v-if="p.status===10">待付款¥<span
              style="font-size: 13px;font-weight: bold;">{{ p.payment }}</span></span>
          <span v-else-if="p.status===20">实付款¥<span style="font-size: 13px;font-weight: bold;">{{ p.payment }}</span></span>
          <span v-else-if="p.status===40">实付款¥<span style="font-size: 13px;font-weight: bold;">{{ p.payment }}</span></span>
          <span v-else-if="p.status===50">实付款¥<span style="font-size: 13px;font-weight: bold;">{{ p.payment }}</span></span>
        </div>
        <van-button class="list-btn1" v-if="p.status===10" round plain hairline size="small"
                    @click="toClose(p.orderId)">
          取消订单
        </van-button>
        <van-button class="list-btn2" v-if="p.status===10" round plain hairline size="small"
                    @click="toDetail(p.orderId)">
          继续付款
        </van-button>
        <div class="cancel-list" v-if="p.status===0">订单已取消</div>
        <van-button class="list-btn1" v-if="p.status===0" round plain hairline size="small"
                    @click="toDelete(p.orderId)">
          删除订单
        </van-button>
        <van-button class="list-btn1" v-if="p.status===20" round plain hairline size="small"
                    @click="toDetail(p.orderId)">
          查看订单
        </van-button>
        <van-button class="list-btn1" v-if="p.status===40" round plain hairline size="small"
                    @click="toDetail(p.orderId)">
          查看订单
        </van-button>
        <van-button class="list-btn1" v-if="p.status===50" round plain hairline size="small"
                    @click="toDetail(p.orderId)">
          查看订单
        </van-button>
      </div>
    </div>

    <div v-if="orderItems.length===0" style="font-size: 11px; color: #999999; text-align: center; margin-top: 180px">---------这里还没有订单哟---------</div>
  </div>

</template>

<style>

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.tab {
  position: fixed;
  width: 100%;
  top: 55px;
  z-index: 100;
}


.ordersALL {
  box-shadow: 0 1px 3px 0 rgba(21, 35, 27, 0.1);
  position: relative;
  width: 90%;
  height: 160px;
//background-color: red; margin: 15px auto;
}

.list-img {
  width: 90px;
  box-shadow: 0 1px 1px 0 rgba(211, 218, 214, 0.3);
  height: 90px;
  position: absolute;
  left: 10px;
  top: 10px;
  border-radius: 5px;
}

.list-name {
  width: 60%;
  position: absolute;
  top: 10px;
  left: 105px;
  font-size: 13px;
  font-family: PublicSans;
  text-align: left;
}

.list-btn1 {
  position: absolute;
  top: 110px;
  right: 10px;
  --van-button-small-font-size: 10px;
}

.list-btn2 {
  position: absolute;
  top: 110px;
  right: 82px;
}

.list-price {
  position: absolute;
  top: 90px;
  right: 10px;
  font-size: 10px;
}


.cancel-list {
  position: absolute;
  font-size: 8px;
  right: 70px;
  top: 122px;
  color: #2e317c;
  letter-spacing: 1px;
  font-family: YouYuan;
}
</style>