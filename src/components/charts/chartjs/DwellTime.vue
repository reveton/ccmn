<template>
    <div class="animated fadeIn">
        <div class="chart-wrapper">
            <bar-chart-js
                    :chart-data="chartData"
                    :options="options"/>
        </div>
    </div>
</template>

<script>
    import BarChartJs from './scripts/BarChartJs.vue';
    import axios from 'axios'
    import moment from 'moment'

    export default {
        name: 'dwell-time',
        components: {
            BarChartJs
        },
        data() {
            return{
                labels: [],
                fiveToThirtyMinutes: [],
                thirtyToSixtyMinutes: [],
                oneToFiveHours: [],
                fiveToEightHours: [],
                eightPlusHours: []
            }
        },
        props: ['params', 'interval'],
        watch: {
            params: async function () {
                await this.getInfo()
            }
        },
        computed: {
            chartData: function () {
                return {
                    labels: this.labels,
                    datasets: [
                        {
                            label: '5-30 mins',
                            backgroundColor: 'rgba(40,167,69,0.5)',
                            borderColor: '#28a745',
                            data: this.fiveToThirtyMinutes
                        },
                        {
                            label: '30-60 mins',
                            backgroundColor: 'rgba(220,53,69,0.5)',
                            borderColor: '#DC3545',
                            data: this.thirtyToSixtyMinutes
                        },
                        {
                            label: '1-5 hours',
                            backgroundColor: 'rgba(0, 123, 255, 0.5)',
                            borderColor: '#007bff',
                            data: this.oneToFiveHours
                        },
                        {
                            label: '5-8 hours',
                            backgroundColor: 'rgba(255,193,7,0.5)',
                            borderColor: '#FFC107',
                            data: this.fiveToEightHours
                        },
                        {
                            label: '8+ hours',
                            backgroundColor: 'rgba(23,162,184,0.5)',
                            borderColor: '#17a2b8',
                            data: this.eightPlusHours
                        }
                    ]
                }
            },
            options: function () {
                return {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Dwell Time'
                    }
                }
            }
        },
        methods:{
            getInfo: async function(){
                axios({
                    method: 'get',
                    url: "https://cisco-presence.unit.ua/api/presence/v1/dwell/" + this.interval,
                    auth: {
                        username: 'RO',
                        password: 'Passw0rd'
                    },
                    params: this.params

                }).then(response => {
                    this.labels.length = 0
                    this.fiveToThirtyMinutes.length = 0
                    this.thirtyToSixtyMinutes.length = 0
                    this.oneToFiveHours.length = 0
                    this.fiveToEightHours.length = 0
                    this.eightPlusHours.length = 0
                    for (let key in response.data) {
                        if (response.data.hasOwnProperty(key)) {
                            this.labels.push(key)
                            this.fiveToThirtyMinutes.push(response.data[key].FIVE_TO_THIRTY_MINUTES)
                            this.thirtyToSixtyMinutes.push(response.data[key].THIRTY_TO_SIXTY_MINUTES)
                            this.oneToFiveHours.push(response.data[key].ONE_TO_FIVE_HOURS)
                            this.fiveToEightHours.push(response.data[key].FIVE_TO_EIGHT_HOURS)
                            this.eightPlusHours.push(response.data[key].EIGHT_PLUS_HOURS)
                        }
                    }
                }).catch(error => console.log('BAD', error))
            }
        }
    }
</script>