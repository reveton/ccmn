<template>
    <div class="col-md-6 col-lg-2">
        <div
            class="card text-white"
            :class="bgclass"
        >
            <div class="card-body">
                <div class="card-left pt-1 float-left">
                    <h3 class="mb-0 fw-r">

                        <div v-if="hasPercentage === 'yes' ">
                            <span class="count float-left" >{{ counter }}</span>
                            <span>{{ symbol }}</span>
                        </div>
                        <div v-if="hasApple === 'yes' ">
                            <span class="count float-left" >{{ maker }}</span>
                            <span>{{ symbol }}</span>
                        </div>
                        <div v-else>

                            <span class="count float-left">

                                <basix-counter
                                  :from = 0
                                  :to = Number(counter)
                                  :duration = "4000"
                                ></basix-counter>

                            </span>
                            <span v-if="symbol">{{ symbol }}</span>
                        </div>

                    </h3>
                    <div class="title-h"><p class="text-light mt-1 m-0">{{ title }}</p></div>
                </div><!-- /.card-left -->

                <div class="card-right float-right text-right">
                    <i
                        class="icon fade-5"
                        :class="icon"
                    ></i>
                </div><!-- /.card-right -->

            </div>
        </div>
    </div>
</template>

<script>
export default{
    name: 'info-icon-box',
    props: ['icon', 'symbol', 'counter', 'title', 'bgclass', 'hasPercentage', 'hasApple', 'maker'],
    // props: {
    //     symbol: String,
    //     counter: Number,
    //     icon: String,
    //     title: String,
    //     bgclass: String,
    //     hasPercentage: String
    // }

}
</script>
<style>
    .title-h {
        float: left;
        width: 100%;
    }
    </style>