<template>
  <h1>{{ store.isLogin }}</h1>
</template>

<script>
import {store} from "@/store";

export default {
  data() {
    return {
      store,
    };
  },
  methods: {

  },
}
</script>
