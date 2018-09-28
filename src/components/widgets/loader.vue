<template>
    <loading
            :show="show"
            :label="label">
    </loading>
</template>
<script>
    import loading from 'vue-full-loading'

    export default {
        components: {
            loading
        },
        data(){
            return {
                show: false,
                label: 'Loading...'
            }
        }
    }
</script>