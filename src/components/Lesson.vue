<template>
    <div>
    <h3 class="my-4">After school club and activities</h3>
    <input type="text" v-model="searchQuery" @input="search" class="form-control search"
        placeholder="Search">
    <div class="my-4">
        <select v-model="selectedSortCategory" class="form-select mb-4" @change="sortItems">
            <option value="subject" selected>Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="spaces">Spaces</option>
        </select>
        <div class="d-flex">
            <div class="form-check mx-2">
                <input v-model="sortOrder" value="ascending" class="form-check-input" type="radio"
                    @change="sortItems" name="sort" id="ascendingOrder" checked>
                <label class="form-check-label" for="ascendingOrder">
                    Ascending
                </label>
            </div>
            <div class="form-check">
                <input v-model="sortOrder" value="descending" class="form-check-input" type="radio"
                    @change="sortItems" name="sort" id="descendingOrder">
                <label class="form-check-label" for="descendingOrder">
                    Descending
                </label>
            </div>
        </div>
    </div>
    <div class="row my-4">
        <div v-for="lesson in lessons" :key="lesson.id" class="col-12 col-sm-12 col-md-6 col-lg-4 g-3">
            <div class="card">
                <div class="d-flex justify-content-between p-4">
                    <div class="p-2">
                        <div class="d-flex">
                            <div class="px-2">Subject:</div>
                            <div v-text="lesson.subject"></div>
                        </div>
                        <div class="d-flex">
                            <div class="px-2">Location:</div>
                            <div v-text="lesson.location"></div>
                        </div>
                        <div class="d-flex">
                            <div class="px-2">Price:</div>
                            <div v-text="lesson.price"></div>
                        </div>
                        <div class="d-flex">
                            <div class="px-2">Spaces:</div>
                            <div v-text="lesson.spaces"></div>
                        </div>
                        <input type="button" v-if="canAddToCart(lesson.id)" @click="addClub(lesson.id)"
                            class="btn btn-primary p-2 mt-2" value="Add to cart" />
                        <input type="button" v-else disabled="disabled" @click="addClub(lesson.id)"
                            class="btn btn-primary p-2 mt-2" value="Add to cart" />
                    </div>
                    <figure class="p-2">
                        <img v-bind:src="baseUrl +'/'+ lesson.image">
                    </figure>
                </div>
            </div>
        </div>
    </div> 
    </div>
</template>

<script>
    export default {
        name: 'Lesson',

        props: ['lessons'],
        data() {
            return {
                searchQuery: "",
                sortOrder: "ascending",
                selectedSortCategory: "subject",
                baseUrl: "https://after-school-app-env.eba-msnmp9d3.eu-west-2.elasticbeanstalk.com"
            }
        },
        methods: {
            canAddToCart: function (id) {
            const selectedLesson = this.lessons.find((lesson) => lesson.id === id)
            if (selectedLesson) {
                return selectedLesson.spaces > 0
            } else return false
        },
        
        search: function () {
            this.$emit('search', this.searchQuery)
        },

        updateLessons: function (lessons) {
            this.$emit('update-lessons', lessons)
        },
        sortItems: async function () {
            try {
                if (this.searchQuery === "") {
                    const res = await fetch(`${this.baseUrl}/api/lessons?sortCategory=${this.selectedSortCategory}&sortOrder=${this.sortOrder}`)
                    const sortLessons = await res.json()
                    this.updateLessons(sortLessons)
                } else {
                    const res = await fetch(`${this.baseUrl}/api/lessons/search/${this.searchQuery}?sortCategory=${this.selectedSortCategory}&sortOrder=${this.sortOrder}`)
                    const sortLessons = await res.json()
                    this.updateLessons(sortLessons)
                }
            } catch (err) {
                console.log(err)
            }
        },
        addClub: function (id) {
            this.$emit('add-item-to-club', id)
        },

        }
    }
</script>