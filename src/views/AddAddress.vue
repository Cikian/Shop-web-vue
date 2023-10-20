<script>
import {areaList} from '@vant/area-data';
import AddressList from "@/views/AddressList.vue";
import axios from "axios";
import {showFailToast, showSuccessToast} from "vant";
import {store} from "@/store";

export default {
  name: "AddAddress",
  data() {
    return {
      store,
      flag: 'edit',
      id: '',
      info: {
        name: '',
        tel: '',
        addressDetail: '',
        isDefault: false,
        areaCode: '',
      },
      addressInfo: {
        receiverName: "",
        receiverPhone: "",
        receiverProvince: "",
        receiverCity: "",
        receiverDistrict: "",
        receiverAddress: ""
      },
      tempArea: "",
      show: false,
      areaCode: '',
      areaList,
    }
  },
  methods: {
    init() {
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
      console.log("session用户信息>>：" + this.userInfo)
      this.flag = this.$route.query.flag
      console.log("接收编辑地址信息flag>>：" + this.flag)
      if (this.flag !== 'add') {
        this.load()
      }
    },

    load() {
      this.info = JSON.parse(this.store.addressInfo)
      this.id = this.info.id
      console.log("接收编辑地址信息>>：" + JSON.stringify(this.store.addressInfo))
      console.log("接收编辑地址信息id>>：" + this.id)

      axios.get('/address/item/' + this.id).then(res => {
        console.log("获取地址信息>>：↓")
        console.log(res)
        if (res.data.code === 2001) {
          this.info = res.data.data
          this.info.isDefault = res.data.data.isDefault === 'true'
        } else {
          showFailToast(res.data.msg)
        }
      })

    },

    onClickLeft() {
      this.$router.push("/addressList")
    },
    closePop() {
      this.show = false;
    },
    onSave(AddressEditInfo) {
      if (this.flag !== 'add') {
        console.log("------------修改")
        AddressEditInfo.id = this.id
        AddressEditInfo.userId = this.userInfo.userId
        console.log("保存地址信息>>：" + JSON.stringify(AddressEditInfo))
        axios.post("/address", AddressEditInfo).then(res => {
          console.log(res)
          if (res.data.code === 4001) {
            showSuccessToast(res.data.msg)
            this.$router.push("/addressList")
          } else {
            console.log("保存地址信息失败>>：" + res)
            showFailToast(res.data.msg)
          }
        })

      }else {
        console.log("------------新增")
        console.log("保存地址信息>>：" + JSON.stringify(AddressEditInfo))
        axios.put("/address", AddressEditInfo).then(res => {
          console.log("保存地址信息>>：" + res)
          if (res.data.code === 3001) {
            showSuccessToast(res.data.msg)
            this.$router.push("/addressList")
          } else {
            console.log("保存地址信息失败>>：" + JSON.stringify(res.data))
            showFailToast(res.data.msg)
          }
        })
      }
    },
    onDelete() {
      console.log("删除地址信息>>：" + this.id)
      axios.delete("/address/" + this.id).then(res => {
        console.log("删除地址信息>>：" + res)
        if (res.data.code === 5001) {
          showSuccessToast(res.data.msg)
          this.$router.push("/addressList")
        } else {
          console.log("删除地址信息失败>>：" + JSON.stringify(res.data))
          showFailToast(res.data.msg)
        }
      })
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<template>
  <van-nav-bar
      left-text="添加收货地址"
      left-arrow
      @click-left="onClickLeft">
  </van-nav-bar>


  <van-address-edit
      :area-list="areaList"
      show-delete
      show-set-default
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
      :address-info="{
        name: info.name,
        tel: info.tel,
        addressDetail: info.addressDetail,
        isDefault: info.isDefault,
        areaCode: info.areaCode,
      }"
  />


</template>

<style>
.add-tabbar {
  --van-tabbar-height: 70px
}

.add-button {
  margin: 12px auto;
  width: 95%;
}

.van-address-list__add{
  background-color: #8cc269;
  border: none;
}

.van-switch--on{
  background-color: #8cc269;
}

.van-button--primary{
  background-color: #8cc269;
  border: none;
}
</style>