<template>


  <div id="input-group" class="box">
    <van-form>
      <van-cell-group inset>
        <van-field
            v-model="shopInfo.receiverName"
            type="text"
            required
            label="收件人"
            placeholder="请输入收件人"
            :rules="[{ required: true, message: '请填写收件人姓名' }]"
        ></van-field>
        <van-field
            v-model="shopInfo.receiverPhone"
            type="tel"
            required
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, message: '请填写手机号' },{pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确'}]"
        />
        <van-field
            label="收货地址"
            v-model="tempArea"
            required
            readonly
            placeholder="请选择收货地址"
            @click="show = !show"
            :rules="[{ required: true, message: '请选择收货地址' }]"
        />

        <van-field
            v-model="shopInfo.receiverAddress"
            type="text"
            required
            label="详细地址"
            placeholder="请输入详细地址"
            :rules="[{ required: true, message: '请填写详细地址' }]"
        />


      </van-cell-group>
    </van-form>
  </div>

  <van-popup v-model:show="show" :style="{ padding: '64px' }" position="bottom" round>
    <van-area title="选择收货地址" :area-list="areaList" v-model="areaCode" @confirm="confirm" @cancel="closePop"/>
  </van-popup>


</template>

<script>

import {store} from "@/store";
import {areaList} from '@vant/area-data';

export default {
  data() {
    return {
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
    };
  },
  mounted() {


  },
  methods: {

    confirm(val) {
      this.shopInfo.receiverProvince = val.selectedOptions[0].text;
      this.shopInfo.receiverCity = val.selectedOptions[1].text;
      this.shopInfo.receiverDistrict = val.selectedOptions[2].text;
      this.tempArea = val.selectedOptions[0].text + "/" + val.selectedOptions[1].text + "/" + val.selectedOptions[2].text;
      this.show = false;
      console.log(this.shopInfo);

    },
    closePop() {
      this.show = false;
    },

  },

}


</script>


<style scoped>
#input-group {
}

.box {
  width: 85vw;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: #b8b6b6 0 0 10px;
}

</style>