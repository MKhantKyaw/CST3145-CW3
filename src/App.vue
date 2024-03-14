<template>
    <div id="app">
       <nav class="navbar bg-body-secondary">
            <div class="container d-flex justify-content-between">
                <a class="navbar-brand p-2" href="#">
                    After School Club
                </a>

                <!-- cart button -->
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
            <strong>HTTPS Test: </strong>
            <a v-bind:href="baseUrl" target="_blank">link</a>
            <button @click="deleteAllCaches">
                <span class="fas fa-trash"></span>
                Delete All Caches
            </button>
            <button @click="unregisterServiceWorkers">
                Unregister Service Workers
            </button>
            <button @click="reloadPage">
                Reload Page
            </button>
            <component 
                :is="currentPage" :selectedSortCategory="selectedSortCategory" :sortOrder="sortOrder" :lessons="lessons" :carts="carts" 
                @change-page="changePage" @add-item-to-club="addClub" @remove-item-from-cart="removeFromCart" @empty-cart="emptyCart"
                @handle-submit="handleSubmit" @search="search" @update-lessons="updateLessons">
            </component>
        </main>
    </div>
</template>

<script>
import Lesson from './components/Lesson.vue';
import Checkout from './components/Checkout.vue';

export default {
    name: 'App',
    components: {
        Lesson,
        Checkout
    },
    data() {
        return {
            sitename: "After School Club",
            baseUrl: "https://after-school-app-env.eba-msnmp9d3.eu-west-2.elasticbeanstalk.com",
            lessons: [],
            carts: [],
            selectedSortCategory: "subject",
            sortOrder: "ascending",
            currentPage: Lesson,
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
            if (this.currentPage === Lesson) {
                this.currentPage = Checkout
            } else {
                this.currentPage = Lesson
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
                this.currentPage = Lesson
            }
        },

        search: async function (searchQuery) {
            try {
                if (searchQuery === "") {
                    const res = await fetch(`${this.baseUrl}/api/lessons?sortCategory=${this.selectedSortCategory}&sortOrder=${this.sortOrder}`)
                    this.lessons = await res.json()
                }
                else {
                    const res = await fetch(this.baseUrl + "/api/lessons/search/" + searchQuery + "?sortCategory=subject&sortOrder=ascending")
                    this.lessons = await res.json()
                }
            } catch (err) {
                console.log(err)
            }
        },

        updateLessons: function (lessons) {
            this.lessons = lessons
        },

        editLesson: function () {
                try {
                    this.carts.forEach(async (lesson) => {
                        await fetch(this.baseUrl + "/api/lessons/" + lesson._id, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(lesson)
                        })
                    })
                }
                catch (err) {
                    console.log(err)
                }
            },  


        handleSubmit: async function (e) {
                const data = { name: this.name, phone: this.phone, lessons: this.carts }
            
                try {
                    const res = await fetch(this.baseUrl + "/api/orders", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    })
                    this.editLesson()
                    if (res.status === 201) {
                        this.name = null
                        this.phone = null
                        this.carts = []
                        this.changePage()
                    }
                } catch (err) {
                    console.log(err)
                }
            },
        emptyCart: function () {
            this.carts = []
        },
        deleteAllCaches() {
            caches.keys().then(function(names) {
                for (let name of names)
                    caches.delete(name);
            });
            console.log("All Caches Deleted");
        },
        unregisterServiceWorkers() {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (let registration of registrations) {
                    registration.unregister()
                }
            })
        },
        reloadPage() {
            window.location.reload()
        }
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
</script>./components/Lesson.vue