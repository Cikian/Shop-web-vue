<template>
  <!--    顶部导航栏-->
  <van-nav-bar
      :title="goodInfo.name"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft">
    <template #right>
      <van-icon name="share-o" size="22" @click="showShare = true"/>
    </template>
  </van-nav-bar>
  <van-notice-bar
      left-icon="volume-o"
      color="black"
      background="rgba(222,236,221,0.5)"
      text="陈哥商城，水院人自己的商城，没有最贵，只有最对，没有尔虞我诈，有的只是真心换真心。"
  />
  <!--轮播图-->
  <div>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" :style="{height:h}">
      <van-swipe-item v-for="(image, index) in subImages" :key="index">
        <img :src="image" :style="{height:h}" style="object-fit: cover; width: 100vw"/>
      </van-swipe-item>
    </van-swipe>
  </div>


  <div class="price1">
      <span class="price" style="color: #ed5a65;position:relative;left: 15px;top:13px;">
        <span style="font-size: 14px;">¥</span>
        <span style="font-size: 20px;position:relative;left: 2px;">{{ goodInfo.price }}</span>
        <span style="font-size: 14px;position:relative;left: 3px;">起</span>
      </span>
  </div>

  <div class="name-div">{{ goodInfo.name }}</div>

  <!--消息框-->
  <!--商品价格-->


  <div class="detail-parameter">
    <div class="param-one">
      <span style="color: rgba(21,35,27,0.6);">参数：</span><span style="color: #000;">{{ goodInfo.detail }}</span>
    </div>
    <div class="param-two">
      <span style="color: rgba(21,35,27,0.6);">参数：</span><span style="color: #000;">{{ goodInfo.subtitle }}</span>
    </div>
  </div>

  <div class="tupian">
    <div class="tupian1">
      <strong class="ziti1" style="color:#000;">购买须知，买前必看</strong>
    </div>
    <h3>关于价保</h3>
    <span>数码类产品价格波动较大，本商城商品的定价随行就市，所有价格以购买当天价格为准，不支持补差价，不支持保价，请购买前确认好购买需求</span>
    <h3>七天无理由</h3>
    <span>支持7天无理由退货</span>
    <span>已拆封产品不支持 7 天无理由退换货，撕开外包装的透明膜/纸质或透明撕拉式均属于已拆封范畴，请确认需求后再拆封</span>
    <br/>
    <strong>备注:李天硕，李浩鑫等闲杂人请勿在此商城消费。</strong>
  </div>
  <div class="tupian2">
    <van-icon name="service-o" size="20px"/>
    服务<br/>
    <van-divider :style="{ color: '#120303', borderColor: '#120303', padding: '0 16px' }">价格说明</van-divider>
    <span>1、商城价: 商城价为商品的销售价，是您最终决定是否购买商品的依据。</span><br/>
    <span>2、划线价:商品展示的划横线价格为参考价，并非原价，该价格可能是品牌专柜标价、
        商品吊牌价或由品牌供应商提供的正品零售价(如厂商指导价、建议零售价等)
        或其他真实有依据的价格;由于地区、时间的差异性和市场行情波动，
        品牌专柜标价、商品吊牌价等可能会与您购物时展示的不一致，该价格仅供您参考。</span><br/>
    <span>3、异常问题:商品促销信息以商品详情页“促销”栏中的信息为准;
        商品的具体售价以订单结算页价格为准;如您发现活动商品售价或促销信息有异常，建议购买前先联系销售商咨询。</span>
  </div>


  <van-divider>暂时没有更多了！</van-divider>

  <van-share-sheet
      v-model:show="showShare"
      :options="options"
      @select="onSelect"
  />

  <!--加入购物车-->
  <div>
    <van-action-bar z-index="100">
      <!--      <van-action-bar-icon icon="star-o" text="收藏"/>-->
      <van-action-bar-icon icon="cart-o" @click="toCart" text="购物车"/>
      <van-action-bar-button color="#8cc269"
                             type="primary"
                             text="加入购物车"
                             @click="show = true"/>
      <van-action-bar-button color="#5bae23" type="primary" text="立即购买" @click="buy">
      </van-action-bar-button>
    </van-action-bar>
  </div>
  <van-popup
      v-model:show="show"
      round
      position="bottom"
      :style="{ height: '50%' }"
  >
    <!--    我姓陈，天生傲骨英雄魂，三杯烈酒闯乾坤，豪情盖世比昆仑-->


    <div class="image">
      <van-image
          width="9rem"
          height="9rem"
          fit="cover"
          position="left"
          :src="goodInfo.mainImage"
          radius="10px"
      />
      <div class="price2">
        <a class="price3">¥{{ goodInfo.price }}</a><br/>
        <van-tag style="position: absolute; left: 165px;top:60px;" round type="danger">预估到手价</van-tag>
      </div>
    </div>
    <div class="down">
      <div class="kc" style="color: rgb(197,197,197)">
        库存剩余:{{ goodInfo.stock }}
      </div>
      <div class="jbq1">
        <van-stepper v-model="count" min="1" :max=max></van-stepper>
      </div>
      <van-button
          class="detail-join-cart-btn"
          type="primary"
          color="#41b349"

          block
          @click="addCart">确认
      </van-button>
    </div>
    <!--    popup中的内容-->
  </van-popup>

</template>

<script>
import axios from "axios";
import {ref} from 'vue';
import {showFailToast, showLoadingToast, showSuccessToast, showToast} from 'vant';
import {store} from "@/store";

export default {
  data() {
    return {
      checkedResult: [
        {
          userId: "",
          goodId: "",
          count: 1,
          name: "",
          subtitle: "",
          mainImage: "",
          price: 0,
        }
      ],
      h: '210px',
      subImages: [],
      goodInfo: {},
      show: false,
      showShare: false,
      num: 1,
      max: 0,
      cart: {
        goodId: '',
        userId: '',
        count: '',
      },
      store,
    }
  },
  setup1() {
    const count = ref(1);
    return {count};
  },
  toCart() {
    this.$router.push("/Cart")
  },
  setup() {
    const showShare = ref(false);
    const options = [
      {name: '微信', icon: 'wechat'},
      {name: '支付宝', icon: 'alipay'},
      {name: '复制链接', icon: 'link'},
      {name: '分享海报', icon: 'poster'},
      {name: '二维码', icon: 'qrcode'},
    ];
    const show = ref(false);
    const showPopup = () => {
      show.value = true;
    };

    const onSelect = (option) => {
      showToast(option.name);
      showShare.value = false;
    };

    return {
      options,
      onSelect,
      showShare,
      show,
      showPopup,
    };
  },
  mounted() {
    let screenW = window.screen.width; //屏幕的宽
    let picW = 750; //图片的宽
    let picH = 750; //图片的高
    this.h = Math.floor(picH * screenW / picW) + 'px';


    let goodId = this.$route.query.goodId;
    this.getGood(goodId);

  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    toCart() {
      this.$router.push("/cart");
    },
    buy() {
      if (this.store.isLogin === false) {
        showToast("请先登录")
        return
      }
      this.checkedResult[0].userId = this.store.userInfo.userId;
      this.checkedResult[0].goodId = this.goodInfo.goodId;
      this.checkedResult[0].name = this.goodInfo.name;
      this.checkedResult[0].subtitle = this.goodInfo.subtitle;
      this.checkedResult[0].mainImage = this.goodInfo.mainImage;
      this.checkedResult[0].price = this.goodInfo.price;
      showLoadingToast({
        message: '正在创建订单...',
        forbidClick: true,
      });
      setTimeout(() => {
        this.$router.push({path: "/subOrder", query: {checkedResult: JSON.stringify(this.checkedResult)}})
      }, 2000)

    },
    getGood(goodId) {

      let that = this;
      console.log("goodId:" + goodId)
      axios.get("/good/" + goodId).then((res) => {
        if (res.data.code === 2001) {
          console.log("111:" + res)
          that.goodInfo = res.data.data;
          that.max = res.data.data.stock;
          if (that.goodInfo.subImages != null) {
            that.subImages = res.data.data.subImages.split(",");
          }
        }
      })
    },
    addCart() {
      if (this.store.isLogin === false) {
        showToast("请先登录")
        return
      }
      let that = this;
      that.cart.goodId = that.goodInfo.goodId;
      that.cart.userId = that.store.userInfo.userId;
      that.cart.count = that.count;
      axios.put("/cart", that.cart).then((res) => {
        if (res.data.code === 3001) {
          showSuccessToast(res.data.msg)
          that.show = false;
        } else {
          showFailToast(res.data.msg)
        }
      })
    }
  },
  components: {}
}
</script>


<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 300px;
  text-align: center;
}

.price1 {
  text-align: left;
  height: 60px;
  margin: 10px auto;

  background-position: center;
}

.price {
  display: inline-block;
  font-size: 26px;
}

.title {
  margin-top: 30px;
  margin-left: 10px;
  margin-right: 10px;
}

.title1 {
  font-size: 15px;
}

.down {
  height: 100px;
  width: 100%;
  position: fixed;
  bottom: 0;
}

.price2 {
  margin-top: 30px;
  margin-left: 10px;
  text-align: left;
}

.price3 {
  position: absolute;
  left: 165px;
  color: #F82E02;
  display: inline-block;
  font-size: 20px;
  text-align: left;
}

.kc {
  position: absolute;
  margin-left: 15px;
  font-size: 16px;
}

.image {
  text-align: left;
  position: relative;
  margin-left: 15px;
  margin-top: 15px;
  display: flex;
}

.jbq1 {
  text-align: right;
  margin-bottom: 10px;
  margin-right: 15px;
}

.text {
  font-size: 15px;
}

.detail-parameter {
  position: relative;
  height: fit-content;
  background: #deecdd;
  width: 90%;
  margin: 10px auto;
  border-radius: 5px;
}


.tupian {
  position: relative;
  width: 94%;
  height: 350px;
  margin: 30px auto;
  background-color: rgba(222, 236, 221, 0.3);
  border-radius: 10px;
}

.tupian1 {
  width: 100%;
  height: 50px;
//margin: 20px auto; background-color: #deecdd;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.ziti1 {
  font-family: YouYuan;
  font-size: 30px;
  line-height: 50px;
}

.tupian2 {
  width: 94%;
  height: fit-content;
  margin: 20px auto;
  background-color: rgba(222, 236, 221, 0.3);
  border-radius: 10px;
  text-align: left;
}

.tupian3 {
  width: 94%;
  height: 200px;
  margin: 20px auto;
  background-color: #efefef;
  border-radius: 10px;
}

.name-div {
  font-family: PublicSans;
  font-size: 20px;
  margin-top: 5px;
  margin-bottom: 10px;
  padding-left: 20px;
  text-align: left;
}

.detail-join-cart-btn {
  width: 90%;
  position: relative;
  margin: auto;
}

.param-one {
  width: 94%;
  text-align: left;
  height: fit-content;
  position: relative;
  padding-top: 10px;
  margin-left: 10px;
}

.param-two {
  width: 94%;
  text-align: left;
  height: fit-content;
  position: relative;
  margin-top: 10px;
  margin-left: 10px;
  padding-bottom: 10px;
}

.van-notice-bar {

}
</style>