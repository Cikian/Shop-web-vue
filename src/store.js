import {reactive} from "vue";

export const store = reactive({
    isLogin: false,
    userInfo: {},
    cartCount: 0,
})