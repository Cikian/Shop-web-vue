<script>
import {showFailToast, showSuccessToast, showToast} from "vant";
import axios from "axios";
import {store} from "@/store";

export default {
  data(){
    return{
      store,
      chosenAddressId: '1',
      list: [],




      userInfo:{
      },
      addShow:false,
    }
  },
  methods:{
    init(){
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
      console.log("session用户信息>>：" + JSON.stringify(this.userInfo))
      axios.get('/address/'+this.userInfo.userId).then(res=>{
        console.log("获取地址信息>>：↓")
        console.log(res)
        if (res.data.code === 2001){
          this.list = res.data.data
        }else {
          showFailToast(res.data.msg)
        }
      })
    },
    onClickLeft() {
      this.$router.push("/my")
    },
    onAdd(){
      this.$router.push({path: "/addAddress", query: {flag: "add"}})
    },
    onEdit(item){
      // 携带此项的id跳转到编辑页面
      console.log("编辑地址信息>>：" + JSON.stringify(item))
      this.store.addressInfo = JSON.stringify(item)
      this.$router.push("/addAddress")
    },

    },
  mounted() {
    this.init()
  }
}
</script>

<template>
  <van-nav-bar
      title="收货地址"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
  />





  <van-address-list

      v-model="chosenAddressId"
      :list="list"
      disabled-text="无收货地址"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
  >
  </van-address-list>






<!--  <van-tabbar class="add-tabbar" fixed border>-->
<!--    <van-button-->
<!--        icon="plus"-->
<!--        class="add-button"-->
<!--        round-->
<!--        hairline-->
<!--        block-->
<!--        type="primary"-->
<!--        color="#ee3f4d"-->
<!--        @click="addAddress"-->
<!--    >-->
<!--      新增收货地址-->
<!--    </van-button>-->
<!--  </van-tabbar>-->

</template>

<style>
#app{
  --van-address-list-radio-color: #8cc269;
}
.add-tabbar{
  --van-tabbar-height:70px
}

.add-button{
  margin:12px auto;
  width: 95%;
}

.van-address-list__add{
  background-color: #8cc269;
  border: none;
}

.van-address-item__tag{
  background-color: #8cc269;
}


</style>