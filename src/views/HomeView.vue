<template>
  <van-search v-model="searchText" placeholder="请输入搜索关键词" @search="onSearch"/>

  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">

    <van-swipe :autoplay="3000" :lazy-render=true style="height: 50vh">
      <van-swipe-item v-for="image in images" :key="image">
        <van-image :src="image" fit="cover" height="100%"/>
      </van-swipe-item>
    </van-swipe>

    <div class="bgc">

      <van-divider
          style="color: #15231b; font-family: YouYuan;letter-spacing: 10px;position: relative;top:10px;font-size: 18px">
        <van-icon name="fire"/>
        推荐商品
      </van-divider>

      <van-card
          class="home-card"
          :price="p.price"
          :desc="p.subtitle"
          :thumb="p.mainImage"
          v-for="(p, index) in goods" :key="index"
          @click="toDetail(p.goodId)"
      >
        <template #title>
          <span style="positon:absolute;">{{ p.name }}</span>
        </template>
      </van-card>
    </div>
  </van-pull-refresh>


</template>

<script>
import {createApp, ref} from 'vue';
import {Card, Lazyload, PullRefresh, Swipe, SwipeItem} from 'vant';
import axios from "axios";
import {store} from "@/store";

const app = createApp();
app.use(Swipe);
app.use(SwipeItem);
app.use(Card);
app.use(PullRefresh);
app.use(Lazyload, {
  lazyComponent: true,
});

export default {
  name: 'App',
  components: {},
  data() {
    const active = ref(0);
    return {
      userInfo: {},
      store,
      active,
      h: '210px',
      goods: [],
      refreshing: false,
      count: 0,
      uname: "",
      images: [
        'https://img-upyun.cikian.cn/develop/Shop-dev/20231011164830.png',
        'https://img-upyun.cikian.cn/develop/Shop-dev/20231011165027.png',
        'https://img-upyun.cikian.cn/develop/Shop-dev/20231011164909.png',
        'https://img-upyun.cikian.cn/develop/Shop-dev/20231011165205.png',
        'https://img-upyun.cikian.cn/develop/Shop-dev/8907ef6a813caa0987d079bc65e6976.jpg',
      ],
      searchText: '',
    };
  },
  mounted() {
    this.loadData();
    let screenW = window.screen.width; //屏幕的宽
    let picW = 750; //图片的宽
    let picH = 400; //图片的高
    this.h = Math.floor(picH * screenW / picW) + 'px';
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    console.log("session 用户信息：" + JSON.stringify(this.userInfo))
    if (this.userInfo != null) {
      this.store.userInfo = this.userInfo
      this.store.isLogin = true
    }
  },
  methods: {
    loadData() {
      let that = this;
      axios.get('/good/rec').then(function (res) {
            that.goods = res.data.data
            that.refreshing = false;
          },
          axios.get("/cart/count").then((res) => {
            if (res.data.code === 2001) {
              this.store.cartCount = res.data.data;
            } else {
            }
          })
      )
    },
    onRefresh() {
      setTimeout(() => {
        this.count++;
        this.refreshing = false;
        this.loadData();
      }, 1000);
    },
    toDetail(goodId) {
      this.$router.push({path: "/detail", query: {goodId: goodId}})
    },
    onSearch() {
      if (this.searchText === '') {
        this.loadData()
        return
      }
      axios.get("/good/search/" + this.searchText).then((res) => {
        if (res.data.code === 2001) {
          this.goods = res.data.data;
        } else {
        }
      })
    },
  },
  watch: {
    handler(newValue, oldValue) {
      this.loadData()
    },
  }

}

</script>

<style>
#app {
  --van-card-desc-color: #c4c4c4;
  --van-card-price-color: #ed5a65;
  --van-search-background: linear-gradient(to right, #c1dfc4 0%, #deecdd 40%, #deecdd 60%, #c1dfc4 100%);
}

.bgc {
  z-index: 0;
  width: 100%;
  background-image: url(../assets/pictures/bg4.png);
  background-size: 100%;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

.home-card {
  text-align: left;
  border-radius: 20px;
  width: 95vw;
  height: 120px;
  margin: 20px auto;
  backdrop-filter: blur(9px);
//background: linear-gradient(to bottom right, rgba(19, 60, 121, 0.5), rgba(168, 184, 199, 0.5)); background-color: rgba(222, 236, 221, 0.6);
  -webkit-backdrop-filter: blur(8px);
//box-shadow:0 0 3px 4px rgba(4, 4, 4, 0.8);
}

.home-card > .van-card__header > .van-card__content > div > span {
  font-size: 16px;
  color: #040404;
}

.van-card__bottom {
  text-align: right;
  margin-right: 5vw;
  font-size: 28px;
}

.van-card__desc {
  margin-top: 10px;
  font-size: 13px;
  color: rgba(44, 44, 44, 0.56);
}


</style>