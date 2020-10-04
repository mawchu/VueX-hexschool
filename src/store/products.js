import axios from 'axios';

export default {
    // state 為模組區域變數 // actions, mutations, getters 為全域變數
    namespaced: true,  // actions, mutations, getters 為區域變數
    state: {
        products: [],
        categories: [],

    },
    actions: {
        getProducts( context ) {
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
            // this.$store.commit('LOADING', true);
            context.commit('LOADING', true, { root: true });
            axios.get(url).then((response) => {
              context.commit('PRODUCTS', response.data.products)
              console.log('取得產品列表:', response);
              context.commit('LOADING', false, { root: true });
            });
        },
    },
    mutations: {
        PRODUCTS(state, payload) {
            state.products = payload;

            const categories = new Set();
            state.products.forEach((item) => {
                categories.add(item.category);
            });
            state.categories = Array.from(categories);
        }
    },
    getters: {
        products(state) {
            return state.products;
        },
        categories(state) {
            return state.categories;
        },
    }
}