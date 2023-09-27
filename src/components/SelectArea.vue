<template>

  <van-area title="选择收货地址" :area-list="areaList" v-model="areaCode" @confirm="confirm"/>


</template>

<script setup>

import {areaList} from '@vant/area-data';
import {ref} from "vue";

const areaCode = ref('');
const areaInfo = ref({
  province: '',
  city: '',
  county: '',
  address: '',
});


// 获取地址信息并返回
const confirm = (val) => {
  areaInfo.value.province = val.selectedOptions[0].text;
  areaInfo.value.city = val.selectedOptions[1].text;
  areaInfo.value.county = val.selectedOptions[2].text;
  areaCode.value = val.code;
  this.$emit('data', val);
};



</script>


<style scoped>

</style>