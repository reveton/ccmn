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
        name: 'repeat-visitors-distribution',
        components: {
            DoughuntChartJs
        },
        data() {
            return{
                daily: null,
                weekly: null,
                occasional: null,
                firstTime: null,
                yesterday: null
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
                        'Daily',
                        'Weekly',
                        'Occasional',
                        'First Time',
                        'Yesterday'
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
                            this.daily,
                            this.weekly,
                            this.occasional,
                            this.firstTime,
                            this.yesterday
                        ]
                    }]
                }
            },
            options: function () {
                return {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Repeat Visitors Distribution'
                    }
                }
            }
        },
        methods:{
            getInfo: async function(){
                axios({
                    method: 'get',
                    url: "https://cisco-presence.unit.ua/api/presence/v1/repeatvisitors/count",
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
                    this.daily = response.data.DAILY;
                    this.weekly = response.data.WEEKLY;
                    this.occasional = response.data.OCCASIONAL;
                    this.firstTime = response.data.FIRST_TIME;
                    this.yesterday = response.data.YESTERDAY
                }).catch(error => console.log('BAD', error))
            }
        }
    }
</script>