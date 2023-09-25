<template>
  <div>
    <van-nav-bar
        :title="goodInfo.name"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
    />
    <div>
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" :style="{height:h}" >
        <van-swipe-item v-for="(image, index) in subImages" :key="index">
          <img :src="image" :style="{height:h}"/>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div>
      <van-notice-bar
          left-icon="volume-o"
          text="陈哥商城，水院人自己的商城，没有最贵，只有最对，没有尔虞我诈，有的只是真心换真心。"
      />
    </div>
    <div>
      <van-cell :border="false" title="" :value="goodInfo.price" style="font-size: 26px"/>
    </div>

  </div>
  <div>
    <van-cell title="商品分享" @click="showShare = true" />
    <van-share-sheet
        v-model:show="showShare"
        title="立即分享给好友"
        :options="options"
        @select="onSelect"
    />
  </div>
  <div>
    <van-action-bar z-index="100">
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="cart-o" text="购物车" />
      <van-action-bar-button color="#be99ff" type="warning" text="加入购物车" />
      <van-action-bar-button color="#7232dd" type="danger" text="立即购买" >
      </van-action-bar-button>
    </van-action-bar>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from 'vue';
import { showToast } from 'vant';

export default {
  data() {
    return {
      h: '210px',
      subImages: [],
      goodInfo: {}
    }
  },
  setup() {
    const showShare = ref(false);
    const options = [
      { name: '微信', icon: 'wechat' },
      { name: '支付宝', icon: 'alipay' },
      { name: '复制链接', icon: 'link' },
      { name: '分享海报', icon: 'poster' },
      { name: '二维码', icon: 'qrcode' },
    ];

    const onSelect = (option) => {
      showToast(option.name);
      showShare.value = false;
    };

    return {
      options,
      onSelect,
      showShare,
    };
  },
  mounted() {
    let screenW = window.screen.width; //屏幕的宽
    let picW = 750; //图片的宽
    let picH = 750; //图片的高
    this.h = Math.floor(picH * screenW / picW) + 'px';


    console.log(this.$route.query.goodId);
    let goodId = this.$route.query.goodId;
    this.getGood(goodId);
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getGood(goodId) {
      let that = this;
      axios.get("/good/" + goodId).then((res) => {
        console.log(res)
        that.goodInfo = res.data.data;
        if (that.goodInfo.subImages != null) {
          that.subImages = res.data.data.subImages.split(",");
        }

        console.log(">>>>>"+that.subImages)

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
  background-color: #39a9ed;
}

</style>