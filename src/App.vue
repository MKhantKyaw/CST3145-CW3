<template>
    <div id="app">
       <nav class="navbar bg-body-secondary">
            <div class="container d-flex justify-content-between">
                <a class="navbar-brand p-2" href="#">
                    After School Club
                </a>
                <button v-if="cartItemCount > 0 || currentPage === 'cart'" @click="changePage" type="button"
                    class="btn btn-light">
                    <font-awesome-icon icon="shopping-cart" />
                    Checkout
                    <span v-if="cartItemCount > 0" class="badge bg-danger">
                        {{cartItemCount}}
                    </span>
                </button>
                <button disabled="disabled" v-else @click="changePage" type="button" class="btn btn-light">
                    <font-awesome-icon icon="shopping-cart" />
                    Checkout
                    <span v-if="cartItemCount > 0" class="badge bg-danger">{{cartItemCount}}</span>
                </button>
            </div>
        </nav>
        <main class="container">
            <component :is="currentPage" :lessons="lessons" :carts="carts" @change-page="changePage" @add-item-to-club="addClub" @remove-item-from-cart="removeFromCart" @empty-cart="emptyCart"></component>
        </main>
    </div>
</template>

<script>
import ProductList from './components/ProductList.vue';
import Checkout from './components/Checkout.vue';

export default {
    name: 'App',
    components: {
        ProductList,
        Checkout
    },
    components: {
        ProductList,
        Checkout
    },
    data() {
        return {
            sitename: "After School Club",
            baseUrl: "https://after-school-app-env.eba-msnmp9d3.eu-west-2.elasticbeanstalk.com",
            lessons: [],
            carts: [],
            searchQuery: "",
            sortItem: [],
            selectedSortCategory: "subject",
            sortOrder: "ascending",
            currentPage: ProductList,
            name: null,
            phone: null,
            canSubmit: false,
            errorMessage: { name: "", phone: "" }
        }
    },
    computed :{
        cartItemCount: function () {
            if (!this.carts) return 0
            let count = 0
            this.carts.forEach(cart => {
                count += cart.count
            })
            return count
        },  
    },
    methods: {
        changePage() {
            if (this.currentPage === ProductList) {
                this.currentPage = Checkout
            } else {
                this.currentPage = ProductList
            }
        },
        addClub: function (id) {
            const selectedLesson = this.lessons.find((lesson) => lesson.id === id)
            selectedLesson.spaces--

            const cartItem = this.carts.find((cart) => cart.id === id)
            if (cartItem) {
                cartItem.count++
                cartItem.spaces--
            }
            else {
                const addedLesson = this.lessons.find((lesson) => lesson.id === id)
                this.carts.push({ ...addedLesson, count: 1 })
            }
        },
        removeFromCart: function (id) {
            const cartItem = this.carts.find((cart) => cart.id === id)
            if (cartItem.count > 1) {
                cartItem.count--
            }
            else {
                this.carts = this.carts.filter((cart) => cart.id !== id)
            }
            const removedLesson = this.lessons.find((lesson) => lesson.id === id)
            removedLesson.spaces++
            if (this.carts.length === 0) {
                this.currentPage = ProductList
            }
        },
        emptyCart: function () {
            this.carts = []
        },
    },
    created: async function () {
        const res = await fetch(`${this.baseUrl}/api/lessons?sortCategory=${this.selectedSortCategory}&sortOrder=${this.sortOrder}`)
        const data = await res.json()
        this.lessons = data

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("service-worker.js")
        }
    }
}
</script>