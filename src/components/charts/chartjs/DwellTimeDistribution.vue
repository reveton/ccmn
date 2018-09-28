<template>
    <div class="animated fadeIn">
        <div class="chart-wrapper">
            <doughunt-chart-js
                    :chart-data="chartData"
                    :options="options"
                    :height="400"    />
        </div>
    </div>
</template>

<script>
    import DoughuntChartJs from './scripts/DoughnutChart.vue';
    import axios from 'axios'
    import moment from 'moment'

    export default {
        name: 'dwell-time-distribution',
        components: {
            DoughuntChartJs
        },
        data() {
            return{
                fiveToThirtyMinutes: null,
                thirtyToSixtyMinutes: null,
                oneToFiveHours: null,
                fiveToEightHours: null,
                eightPlusHours: null
            }
        },
        props: ['params'],
        watch: {
            params: async function () {
                await this.getInfo()
            }
        },
        computed: {
            chartData: function () {
                return {
                    labels: [
                        '5-30 mins',
                        '30-60 mins',
                        '1-5 hours',
                        '5-8 hours',
                        '8+ hours'
                    ],
                    datasets: [{
                        backgroundColor: [
                            '#28a745',
                            '#DC3545',
                            '#007bff',
                            '#FFC107',
                            '#17a2b8'
                        ],
                        borderColor: [
                            'rgba(40,167,69,0.5)',
                            'rgba(220,53,69,0.5)',
                            'rgba(0, 123, 255, 0.5)',
                            'rgba(255,193,7,0.5)',
                            'rgba(23,162,184,0.5)'
                        ],
                        data: [
                            this.fiveToThirtyMinutes,
                            this.thirtyToSixtyMinutes,
                            this.oneToFiveHours,
                            this.fiveToEightHours,
                            this.eightPlusHours

                        ]
                    }]
                }
            },
            options: function () {
                return {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Dwell Time Distribution'
                    }
                }
            }
        },
        methods:{
            getInfo: async function(){
                axios({
                    method: 'get',
                    url: "https://cisco-presence.unit.ua/api/presence/v1/dwell/count/",
                    auth: {
                        username: 'RO',
                        password: 'Passw0rd'
                    },
                    params: {
                        siteId: this.params.siteId,
                        startDate: this.params.startDate,
                        endDate: this.params.endDate
                    }

                }).then(response => {
                    this.fiveToThirtyMinutes = response.data.FIVE_TO_THIRTY_MINUTES
                    this.thirtyToSixtyMinutes = response.data.THIRTY_TO_SIXTY_MINUTES
                    this.oneToFiveHours = response.data.ONE_TO_FIVE_HOURS
                    this.fiveToEightHours = response.data.FIVE_TO_EIGHT_HOURS
                    this.eightPlusHours = response.data.EIGHT_PLUS_HOURS
                }).catch(error => console.log('BAD', error))
            }
        }
    }
</script>