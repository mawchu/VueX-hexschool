
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import productsModule from './products';

Vue.use(Vuex);
export default new Vuex.Store({
    strict: true,
    state: {
        isLoading: false,
        cart: {
            carts: []
        }
    },
    actions: {
        getCart( context ) {
            context.commit('LOADING', true); // 直接呼叫 mutation的方式
            // this.$store.dispatch('updateLoading', true); // 通過 actions context.commit 呼叫 mutations
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            axios.get(url).then((response) => {
              if (response.data.data.carts) {
                context.commit('CART',response.data.data);
              }
              context.commit('LOADING', false);
              console.log('取得購物車', response.data.data);
            });
        },
        removeCart( context, id ) {
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
            axios.delete(url).then((response) => {
              context.dispatch('getCart');// 在actions 中呼叫其他 actions
              console.log('刪除購物車項目', response);
            });
        },
        addtoCart( context , {id, qty} ) {
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            context.commit('LOADING',true);
            const item = {
              product_id: id,
              qty
            };
            context.commit('LOADING',true);
            axios.post(url, { data: item }).then((response) => {
              context.commit('LOADING', false);
              console.log('加入購物車:', response);
              context.dispatch('getCart');// 讓購物車數字同步
            });
        },
    },
    mutations: {
        LOADING(state, payload) { // payload 為元件傳入的值
            state.isLoading = payload;
        },
        CART(state, payload) {
            state.cart = payload;
        }
    },
    getters: {
        isLoading(state) {
            return state.isLoading;
        },
        cart(state) {
            return state.cart;
        }
    },
    modules: {
        productsModule,
    }
});

