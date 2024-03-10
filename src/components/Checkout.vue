<template>
    <div class="container">
        <h3>Shopping Cart</h3>
        <div class="row">
            <div v-for="cart in carts" :key="cart.id" class="col-12 col-sm-12 col-md-6 col-lg-4 g-3">
                <div class="card border border-1">
                    <div class="d-flex justify-content-between p-4">
                        <div class="p-2">
                            <div class="d-flex">
                                <div class="px-2">Subject:</div>
                                <div v-text="cart.subject"></div>
                            </div>
                            <div class="d-flex">
                                <div class="px-2">Location:</div>
                                <div v-text="cart.location"></div>
                            </div>
                            <div class="d-flex">
                                <div class="px-2">Price:</div>
                                <div v-text="cart.price"></div>
                            </div>
                            <div class="d-flex">
                                <div class="px-2">Quantity:</div>
                                <div v-text="cart.count"></div>
                            </div>
                            <input type="button" class="btn btn-primary p-2 mt-2" value="Remove 1"
                                @click="removeFromCart(cart.id)" />
                        </div>
                        <figure class="p-2">
                            <img v-bind:src="baseUrl + '/' + cart.image">
                        </figure>
                    </div>
                </div>
            </div>
        </div>

        <div class="card px-5 py-4 mt-5">
            <form @submit="handleSubmit" method="POST">
                <div class="row gx-5">
                    <div class="col-12 col-md-6 g-3">
                        <h3 class="mb-4">Checkout</h3>
                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input v-model="name" v-bind:class="(this.errorMessage.name) ?  'is-invalid': ''"
                                type="text" class="form-control" id="name">
                            <span class="text-danger">{{errorMessage.name}}</span>
                        </div>
                        <div class="mb-3">
                            <label for="phone" class="form-label">Phone</label>
                            <input v-model="phone" v-bind:class="(this.errorMessage.phone) ? 'is-invalid' : ''"
                                type="text" class="form-control" id="phone">
                            <span class="text-danger">{{errorMessage.phone}}</span>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 g-3">
                        <h3 class="mb-4">Order Information</h3>
                        <div class="d-flex my-2">
                            <div class="px-2">Name:</div>
                            <div v-text="name"></div>
                        </div>
                        <div class="d-flex my-2">
                            <div class="px-2">Phone:</div>
                            <div v-text="phone"></div>
                        </div>
                        <button type="submit" v-if="nameValidate === true && phoneValidate === true"
                            class="btn btn-primary my-2">Submit</button>
                        <button type="submit" disabled="disabled" v-else
                            class="btn btn-primary my-2">Submit</button>
                    </div>
                </div>
            </form>
        </div>
        
    </div>
</template>

<script>
    export default {
        name: 'Checkout',
        props: ['carts'],
        data() {
            return {
                baseUrl: "https://after-school-app-env.eba-msnmp9d3.eu-west-2.elasticbeanstalk.com",
                name: null,
                phone: null,
                errorMessage: { name: "", phone: "" }
            }
        },
        computed: {
            nameValidate: function () {
            this.errorMessage.name = ""
            if (this.name) {
                const regex = new RegExp("^[a-zA-Z ]*$")
                if (regex.test(this.name)) {
                    this.errorMessage.name = ""
                    return true
                }
                else {
                    this.errorMessage.name = "Please enter valid name"
                    return false
                }
            }

            return 0
        },

        phoneValidate: function () {
            this.errorMessage.phone = ""
            if (this.phone) {
                const regex = new RegExp("^[0-9]*$")
                if (regex.test(this.phone)) {
                    this.errorMessage.phone = ""
                    return true
                }
                else {
                    this.errorMessage.phone = "Please enter valid phone number"
                    return false
                }
            }
            return 0
        },

        },
        methods: {
            handleSubmit: function (event) {
                event.preventDefault()
                this.$emit('handle-submit', this.name, this.phone)
            },
            removeFromCart: function (id) {
                this.$emit('remove-item-from-cart', id)
            },
                      
        },
    }
</script>