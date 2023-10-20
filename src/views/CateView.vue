<template>
  <!--  <h1>{{ store.isLogin }}</h1>-->
  <van-dropdown-menu active-color="#ee0a24">
    <van-dropdown-item v-model="value1" :options="option1" @change="valueOnChange"/>
    <van-dropdown-item v-model="value2" :options="option2" @change="valueOnChange"/>
  </van-dropdown-menu>

  <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="margin-bottom: 10vh">


    <van-card
        class="cate-card"
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
import {Card, Lazyload, PullRefresh} from 'vant';
import axios from "axios";
import {store} from "@/store";
import {createApp} from "vue";

const app = createApp();
app.use(Card);
app.use(PullRefresh);
app.use(Lazyload, {
  lazyComponent: true,
});

export default {
  data() {
    return {
      refreshing: false,
      value1: "101",
      value2: 'a',
      option1: [],
      option2: [
        {text: '默认排序', value: 'a'},
        {text: '价格升序', value: 'up'},
        {text: '价格降序', value: 'down'},
      ],
      goods: [],
      store,
    };
  },
  mounted() {
    axios.get("/cate/").then((res) => {
          this.option1 = res.data.data
        }
    )

    this.loadData();
  },
  methods: {
    loadData() {
      let that = this;
      axios.get('/good/').then(function (res) {
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
    getAllByOrder(order) {
      let that = this;
      axios.get('/good/order/' + order).then(function (res) {
        that.goods = res.data.data
        that.refreshing = false;
      })
    },
    toDetail(goodId) {
      this.$router.push({path: "/detail", query: {goodId: goodId}})
    },
    onRefresh() {
      setTimeout(() => {
        this.count++;
        this.refreshing = false;
        this.loadData();
      }, 1000);
    },
    valueOnChange() {
      if (this.value1 === "101") {
        this.getAllByOrder(this.value2)
        return
      }
      axios.get("/good/cate/" + this.value1 + '/' + this.value2).then((res) => {
        if (res.data.code === 2001) {
          this.goods = res.data.data;
        } else {
        }
      })
    },

  },
}
</script>

<style>
.cate-card {
  text-align: left;

}
</style>