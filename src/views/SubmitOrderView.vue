<template>
  <van-nav-bar class="nav"
               title="确&nbsp;&nbsp认&nbsp;&nbsp订&nbsp;&nbsp单"
               left-text="返回"
               left-arrow
               @click-left="onClickLeft"
  />

  <div class="box">
    <van-address-list
        style="text-align: left;"
        v-model="chosenAddressId"
        :show-add-button=false
        :list="list"
        default-tag-text="收货信息"
        @edit="showSelectAddress = true"
        @click-item="showSelectAddress = true"
    />
  </div>

  <van-popup
      v-model:show="showSelectAddress"
      position="bottom"
      :style="{ height: '80%' }"
  >
    <van-address-list
        v-model="chosedAddId"
        :list="allAddress"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @click-item="addressChange"
        @select="addressChange"
    />
  </van-popup>

  <!--  <div id="input-group" class="box">-->
  <!--    <van-form>-->
  <!--      <van-cell-group inset @change="shoppingInfoOnChange">-->
  <!--        <van-field-->
  <!--            v-model="orderView.shopping.receiverName"-->
  <!--            type="text"-->
  <!--            required-->
  <!--            label="收件人"-->
  <!--            placeholder="请输入收件人"-->
  <!--            :rules="[{ required: true, message: '请填写收件人姓名' }]"-->
  <!--        ></van-field>-->
  <!--        <van-field-->
  <!--            v-model="orderView.shopping.receiverPhone"-->
  <!--            type="tel"-->
  <!--            required-->
  <!--            label="手机号"-->
  <!--            placeholder="请输入手机号"-->
  <!--            :rules="[{ required: true, message: '请填写手机号' },{pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确'}]"-->
  <!--        />-->
  <!--        <van-field-->
  <!--            is-link-->
  <!--            label="收货地址"-->
  <!--            v-model="tempArea"-->
  <!--            required-->
  <!--            readonly-->
  <!--            placeholder="请选择收货地址"-->
  <!--            @click="show = !show"-->
  <!--            :rules="[{ required: true, message: '请选择收货地址' }]"-->
  <!--        />-->

  <!--        <van-field-->
  <!--            v-model="orderView.shopping.receiverAddress"-->
  <!--            type="text"-->
  <!--            required-->
  <!--            label="详细地址"-->
  <!--            placeholder="请输入详细地址"-->
  <!--            :rules="[{ required: true, message: '请填写详细地址' }]"-->
  <!--        />-->

  <!--      </van-cell-group>-->
  <!--    </van-form>-->

  <!--  </div>-->

  <div class="box">

    <van-card
        class="sub-card"
        :num="p.count"
        :price="p.price"
        :title="p.name"
        :desc="p.subtitle"
        :thumb="p.mainImage"
        v-for="(p, index) in orderView.orderItemList" :key="index"
    >
    </van-card>

  </div>

  <div class="box" style="margin-bottom: 15vh">

    <van-field v-model="postServe"
               is-link
               readonly
               name="picker"
               clearable
               label="配送服务"
               @click="showAction1 = true"
    />
    <van-field v-model="paymentTypeText"
               is-link
               readonly
               name="picker"
               clearable
               label="支付方式"
               @click="showAction2 = true"
    />


    <van-field
        v-model="orderView.remark"
        is-link
        readonly
        label="备注"
        placeholder="请输入备注"
        @click="showAction3 = true"
    />


  </div>


  <van-submit-bar
      v-if="!submitFlag"
      :disabled="!submitFlag"
      :price="totalPrice"
      button-text="提交订单"
      tip="收货信息不完整"
      tip-icon="info-o"
  >
    <span style="margin-left: 5vw; color: #b8b6b6">
      共
      <span style="font-size: 18px; color: #797979">
        {{ totalCount }}
      </span>
      件
    </span>
  </van-submit-bar>
  <van-submit-bar
      v-else
      :disabled="!submitFlag"
      :price="totalPrice"
      button-text="提交订单"
      :loading="submitLoading"
      @submit="onSubmit"
  >
    <span style="margin-left: 5vw; color: #b8b6b6">
      共
      <span style="font-size: 18px; color: #797979">
        {{ totalCount }}
      </span>
      件
    </span>
  </van-submit-bar>


  <van-popup v-model:show="show" :style="{ padding: '64px' }" position="bottom" round>
    <van-area title="选择收货地址" :area-list="areaList" v-model="areaCode" @confirm="confirm" @cancel="closePop"/>
  </van-popup>

  <van-action-sheet v-model:show="showAction1" title="选择配送服务">
    <div class="content" style="padding: 16px 16px 160px 16px; text-align: left">

      <van-radio-group v-model="postServe">
        <van-cell-group inset>
          <van-cell title="快递 免邮" clickable @click="postServe = '快递 免邮'">
            <template #right-icon>
              <van-radio name="快递 免邮"/>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

    </div>
  </van-action-sheet>

  <van-action-sheet v-model:show="showAction2" title="选择支付方式">
    <div class="content" style="padding: 16px 16px 160px 16px; text-align: left">
      <van-radio-group v-model="paymentType">
        <van-cell-group inset>
          <van-cell title="支付宝" clickable @click="changePayType">
            <template #right-icon>
              <van-radio name=1></van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </van-action-sheet>

  <van-action-sheet v-model:show="showAction3" title="订单备注">
    <div class="content" style="padding: 16px 16px 160px 16px; text-align: left">
      <van-cell-group inset>
        <van-field
            v-model="orderView.remark"
            rows="5"
            autosize
            label="备注"
            type="textarea"
            maxlength="120"
            placeholder="请输入备注"
            show-word-limit
        />
      </van-cell-group>
    </div>
  </van-action-sheet>


</template>

<script>

import {store} from "@/store";
import {areaList} from '@vant/area-data';
import axios from "axios";
import {showConfirmDialog, showFailToast, showSuccessToast, showToast} from "vant";
import qs from "qs";

export default {
  data() {
    return {
      chosenAddressId: '1',
      allAddress: [],
      list: [
        {
          id: '1',
          name: '',
          tel: '',
          address: '',
          isDefault: true,
        },
      ],
      showSelectAddress: false,
      chosedAddId: '',


      orderView: {
        userId: '',
        shopping: {
          receiverName: "",
          receiverPhone: "",
          receiverProvince: "",
          receiverCity: "",
          receiverDistrict: "",
          receiverAddress: ""
        },
        orderItemList: [],
        payment: 0,
        paymentType: 1,
        postPrice: 0,
        remark: "",

      },

      show: false,
      areaCode: '',
      store,
      areaList,
      tempArea: '',
      shopInfo: {
        receiverName: '',
        receiverPhone: '',
        receiverProvince: '',
        receiverCity: '',
        receiverDistrict: '',
        receiverAddress: '',
      },

      totalCount: 0,
      totalPrice: 0,
      paymentType: '1',
      postPrice: 0,

      showAction1: false,
      showAction2: false,
      showAction3: false,

      postServe: '快递 免邮',

      paymentTypeText: '支付宝',

      submitFlag: false,

      submitLoading: false,


    };
  },
  mounted() {
    this.loadShoppingInfo();
    // 接收checkedResult
    this.orderView.orderItemList = JSON.parse(this.$route.query.checkedResult);
    console.log("goods: " + JSON.stringify(this.orderView.orderItemList));
    // 计算总价与总数
    this.orderView.payment = this.orderView.orderItemList.reduce((total, item) => {
      return total + item.price * item.count;
    }, 0);
    this.totalCount = this.orderView.orderItemList.reduce((total, item) => {
      return total + item.count;
    }, 0);
    this.totalPrice = this.orderView.payment * 100;
    console.log("总价：" + this.orderView.payment);
    console.log("总数：" + this.totalCount);
    this.loadAllAddress()
  },
  methods: {


    onClickLeft() {
      this.$router.go(-1);
    },


    loadShoppingInfo() {
      let that = this;
      axios.get("/address/default/" + that.store.userInfo.userId).then((res) => {
        if (res.data.code === 2001) {
          that.shopInfo = res.data.data;
          that.orderView.shopping.receiverName = res.data.data.name;
          that.orderView.shopping.receiverPhone = res.data.data.tel;
          that.orderView.shopping.receiverProvince = res.data.data.province;
          that.orderView.shopping.receiverCity = res.data.data.city;
          that.orderView.shopping.receiverDistrict = res.data.data.county;
          that.orderView.shopping.receiverAddress = res.data.data.addressDetail;
          that.tempArea = res.data.data.province + "/" + res.data.data.city + "/" + res.data.data.county + "/" + res.data.data.addressDetail;
          that.show = false;
          that.shoppingInfoOnChange();
          that.chosedAddId = res.data.data.id;
          that.list[0].name = res.data.data.name;
          that.list[0].tel = res.data.data.tel;
          that.list[0].address = res.data.data.province + res.data.data.city + res.data.data.county + res.data.data.addressDetail;
        } else {

          showConfirmDialog({
            title: '请添加收货地址',
            message:
                '您还没有收货地址😢，点击确定按钮新增一个收货地址~',
          }).then(() => {
            this.$router.push({path: "/addAddress", query: {flag: "add"}})
          }).catch(() => {
            this.$router.push("/")
          });
        }
      })
    },

    loadAllAddress() {
      axios.get('/address/' + this.store.userInfo.userId).then(res => {
        console.log("获取地址信息>>：↓")
        console.log(res)
        if (res.data.code === 2001) {
          this.allAddress = res.data.data
        } else {
          showFailToast(res.data.msg)
        }
      })
    },

    addressChange(item, index) {
      axios.get('/address/item/' + item.id).then(res => {
        console.log("获取地址信息>>：↓")
        console.log(res)
        if (res.data.code === 2001) {
          this.orderView.shopping.receiverName = res.data.data.name;
          this.orderView.shopping.receiverPhone = res.data.data.tel;
          this.orderView.shopping.receiverProvince = res.data.data.province;
          this.orderView.shopping.receiverCity = res.data.data.city;
          this.orderView.shopping.receiverDistrict = res.data.data.county;
          this.orderView.shopping.receiverAddress = res.data.data.addressDetail;
          this.tempArea = res.data.data.province + "/" + res.data.data.city + "/" + res.data.data.county + "/" + res.data.data.addressDetail;
          this.show = false;
          this.shoppingInfoOnChange();
          this.chosedAddId = res.data.data.id;
          this.list[0].name = res.data.data.name;
          this.list[0].tel = res.data.data.tel;
          this.list[0].address = res.data.data.province + res.data.data.city + res.data.data.county + res.data.data.addressDetail;
        } else {
          showFailToast(res.data.msg)
        }
      }).finally(() => {
        this.showSelectAddress = false
      })
    },


    confirm(val) {
      this.orderView.shopping.receiverProvince = val.selectedOptions[0].text;
      this.orderView.shopping.receiverCity = val.selectedOptions[1].text;
      this.orderView.shopping.receiverDistrict = val.selectedOptions[2].text;
      this.tempArea = val.selectedOptions[0].text + "/" + val.selectedOptions[1].text + "/" + val.selectedOptions[2].text;
      this.show = false;
      this.shoppingInfoOnChange();
      console.log(this.orderView.shopping);

    },
    closePop() {
      this.show = false;
    },

    changePayType() {
      this.orderView.paymentType = 1
      this.paymentTypeText = '支付宝';
      this.showAction2 = false;
    },

    shoppingInfoOnChange() {
      // 如果收货信息中的任何信息未填则submitFlag为false
      if (this.orderView.shopping.receiverName === '' || this.orderView.shopping.receiverPhone === '' || this.orderView.shopping.receiverProvince === '' || this.orderView.shopping.receiverCity === '' || this.orderView.shopping.receiverDistrict === '' || this.orderView.shopping.receiverAddress === '') {
        this.submitFlag = false;
        console.log("submitFlag:" + this.submitFlag);
        console.log("提交参数: " + JSON.stringify(this.orderView));
      } else {
        this.submitFlag = true;
        console.log("submitFlag:" + this.submitFlag);
        console.log("提交参数: " + JSON.stringify(this.orderView));
      }
    },

    onSubmit() {
      let that = this
      that.submitLoading = true
      that.orderView.userId = that.store.userInfo.userId
      axios.put("/order", this.orderView).then((res) => {
        if (res.data.code === 3001) {
          // 删除购物车中的商品
          for (let i = 0; i < that.orderView.orderItemList.length; i++) {
            axios.delete('/cart/' + that.store.userInfo.userId + '/' + that.orderView.orderItemList[i].goodId).then(function (res) {
            }).catch(function (err) {
            })
          }
          showSuccessToast(res.data.msg)
          showSuccessToast("正在跳转支付页面")
          setTimeout(function () {
            axios.post('/alipay/pay', qs.stringify({
              orderNo: res.data.data,
              amount: that.orderView.payment
            }))
                .then(function (response) {
                  // 处理成功情况
                  document.querySelector("body").innerHTML = response.data; // 查找到当前页面的body，将后台返回的form替换掉他的内容
                  document.forms[0].submit();
                })


            // 此处地址应为后台支付页面
            // window.open("http://localhost:8081/alipay/pay?subject=" + "Cikian商城购买商品" + "&totalPrice=" + that.orderView.payment + "&traceNo=" + res.data.data)
          }, 2000)
        } else {
          showFailToast(res.data.msg)
          that.submitLoading = false
        }
      })
    },

    onAdd() {
      this.$router.push({path: "/addAddress", query: {flag: "add"}})
    },
    onEdit(item) {
      // 携带此项的id跳转到编辑页面
      console.log("编辑地址信息>>：" + JSON.stringify(item))
      this.store.addressInfo = JSON.stringify(item)
      this.$router.push("/addAddress")
    },


  },

}


</script>


<style>
#app {
  --van-address-list-radio-color: #8cc269;
}

#input-group {
}

.box {
  width: 85vw;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: #b8b6b6 0 0 10px;
}

.van-address-list {
  padding: 12px 0;
}

.sub-card .van-card__num {
  font-size: 12px;
}

.van-address-item__tag {
  background-color: #8cc269;
}

.van-address-list__add {
  background-color: #8cc269;
  border: none;
}

.van-address-item__tag {
  background-color: #8cc269;
}

</style>