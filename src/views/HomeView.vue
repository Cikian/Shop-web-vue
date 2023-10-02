<template>
  <van-search v-model="searchText" placeholder="请输入搜索关键词" @search="onSearch"/>


  <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="margin-bottom: 10vh">

    <van-swipe :autoplay="3000" :lazy-render=true :style="{height:h}">
      <van-swipe-item v-for="image in images" :key="image">
        <img :src="image" :style="{height:h}"/>
      </van-swipe-item>
    </van-swipe>

    <van-card
        :price="p.price"
        :title="p.name"
        :desc="p.subtitle"
        :thumb="p.mainImage"
        v-for="(p, index) in goods" :key="index"
        @click="toDetail(p.goodId)"
    >
    </van-card>

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
      store,
      active,
      h: '210px',
      goods: [],
      refreshing: false,
      count: 0,
      uname: "",
      images: [
        'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
        'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
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
  },
  methods: {
    loadData() {
      let that = this;
      axios.get('/good/rec').then(function (res) {
            console.log(res);
            that.goods = res.data.data
            that.refreshing = false;
          },
          axios.get("/cart/count").then((res) => {
            console.log(res)
            if (res.data.code === 2001) {
              this.store.cartCount = res.data.data;
              console.log("获取购物车数量成功:" + this.store.cartCount)
            } else {
              console.log("获取购物车数量失败")
            }
          })
      )
    },
    onRefresh() {
      setTimeout(() => {
        console.log('刷新成功');
        this.count++;
        this.refreshing = false;
        this.loadData();
      }, 1000);
    },
    toDetail(goodId) {
      console.log("goodId" + goodId)
      this.$router.push({path: "/detail", query: {goodId: goodId}})
    },
    onSearch() {
      if (this.searchText === '') {
        this.loadData()
        return
      }
      axios.get("/good/search/" + this.searchText).then((res) => {
        console.log(res)
        if (res.data.code === 2001) {
          this.goods = res.data.data;
          console.log("搜索成功:" + this.goods)
        } else {
          console.log("搜索失败")
        }
      })
    },
  },
  watch: {
    handler(newValue, oldValue) {
      console.log(newValue, oldValue)
      this.loadData()
    },
  }

}

</script>
