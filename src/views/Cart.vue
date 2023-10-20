<template>
  <van-nav-bar class="nav"
               title="购&nbsp;&nbsp物&nbsp&nbsp车"
               left-text="返回"
               left-arrow
               @click-left="onClickLeft"
  />


  <!--  全选按钮 -->
  <div style="margin-left: 5vw;">
    <van-checkbox-group checked-color="#70a875" v-model="checkedResult" @change="checkedResultChange">
      <van-checkbox v-for="(good, index) in goods" :key="index" :name="good" style="margin-right: 0">
        <van-swipe-cell>
          <van-card
              :price="good.price"
              :desc="good.subtitle"
              :title="good.name"
              class="cart-card"
              :thumb="good.mainImage"
              @click-thumb="toDetail(good.goodId)"
              style="width: 88vw; margin-left: 2vw"
          >
            <template #footer>
              <van-stepper
                  v-model="good.count"
                  @plus="plusNum(good.count)"
                  @minus="minusNum(good.count)"
                  min="1"
              />
            </template>
          </van-card>
          <template #right>
            <van-button square text="移除" type="danger" class="delete-button" @click="deleteCartItem(good.goodId)"/>
          </template>
        </van-swipe-cell>
      </van-checkbox>
    </van-checkbox-group>
  </div>


  <van-divider dashed>暂时没有更多</van-divider>
  <van-submit-bar :price="totalPrice" button-text="结算" :disabled="notSelect" @submit="onSubmit" class="submit_bar">
    <van-checkbox checked-color="#70a875" v-model=isCheckAll :indeterminate="isIndeterminate" @change="checkAllChange">全选</van-checkbox>
  </van-submit-bar>

</template>

<script>
import axios from "axios";
import list from "core-js/internals/array-iteration";
import {store} from "@/store";
import {showLoadingToast} from "vant";


export default {

  data() {
    return {
      notSelect: true,
      totalPrice: 0,
      store,
      width: '450px',
      userInfo: {},
      goods: [],
      isCheckAll: false,
      checkedResult: [],
      isIndeterminate: false,
    }
  },
  mounted() {
    let navHeight = document.getElementsByClassName("van-tabbar")[0].offsetHeight;
    console.log("底部导航栏高度： " + navHeight)

    let that = this;
    if (that.store.isLogin === false) {
      that.$router.push("/login")
    } else {
      that.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      that.loadData();
    }

    let screenW = window.screen.width; //屏幕的宽
    this.width = Math.floor(screenW) + 'px';
  },
  methods: {
    checkAllChange(value) {
      // 如果goods为空，则不能全选
      if (this.goods.length === 0) {
        this.isCheckAll = false;
        return;
      }
      this.checkedResult = value ? this.goods : [];
      this.isIndeterminate = false;
    },
    checkedResultChange(value) {
      let that = this;
      const goodsLength = that.goods.length;
      that.checkedResult = value;
      that.isCheckAll = value.length === goodsLength;
      that.isIndeterminate = value.length > 0 && value.length < goodsLength;
      // 总价等于当前总价加上选中的商品的价格乘以数量
      that.totalPrice = 0;
      for (let i = 0; i < that.checkedResult.length; i++) {
        that.totalPrice += that.checkedResult[i].price * that.checkedResult[i].count;
      }
      that.totalPrice *= 100;
      that.notSelect = that.totalPrice === 0;


    },

    loadData() {
      let that = this;
      axios.get('/cart/' + that.userInfo.userId).then(function (res) {
        that.goods = res.data.data;
      }).catch(function (err) {
      })
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    deleteCartItem(goodId) {
      let that = this
      // 判断当前商品是否被选中，如果被选中，先取消选中，然后从checkedResult中删除
      for (let i = 0; i < that.checkedResult.length; i++) {
        if (that.checkedResult[i].goodId === goodId) {
          that.checkedResult.splice(i, 1);
          that.checkedResultChange(that.checkedResult);
          break;
        }
      }

      axios.delete('/cart/' + that.userInfo.userId + '/' + goodId).then(function (res) {
        that.loadData()
      }).catch(function (err) {
      })
    },
    toDetail(goodId) {
      this.$router.push({path: "/detail", query: {goodId: goodId}})
    },

    onSubmit() {
      showLoadingToast({
        message: '正在创建订单...',
        forbidClick: true,
      });
      setTimeout(() => {
        this.$router.push({path: "/subOrder", query: {checkedResult: JSON.stringify(this.checkedResult)}})
      }, 2000)
    },

    plusNum(count){
      event.stopPropagation();  // 阻止事件冒泡
      count++
      console.log(count);
    },
    minusNum(count){
      event.stopPropagation();  // 阻止事件冒泡
      count--
      console.log(count);
    }

  },

  components: {}
}
</script>

<style>
#app {
  --van-checkbox-size: 20px;

}

.cart-card {
  margin: 0;
  width: 100%;
}

.cart-card > .van-card__num{

}

.delete-button {
  height: 100%;
}

.submit_bar {

  bottom: 50px;

}

</style>