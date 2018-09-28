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

    export default {
        name: 'proximity-distribution',
        components: {
            DoughuntChartJs
        },
        props:['params'],
        watch:{
            params: async function(){
                await this.getSummary();
            }
        },
        data() {
            return {
                totalPasserby: null,
                totalVisitors: null,
                totalConnected: null
            }
        },
        methods: {
            getSummary() {
                let summary_sec = this
                if (this.params.startDate === this.params.endDate) {
                    axios({
                        method: 'get',
                        url: "https://cisco-presence.unit.ua/api/presence/v1/kpisummary/today",
                        auth: {
                            username: 'RO',
                            password: 'Passw0rd'
                        },
                        params: this.params

                    }).then(response => {
                        summary_sec.totalVisitors = response.data.totalVisitorCount
                        summary_sec.totalPasserby = response.data.totalPasserbyCount
                        summary_sec.totalConnected = response.data.totalConnectedCount
                        this.loaded = true;
                    })
                        .catch(error => console.log('BAD', error))
                }
                else {
                    axios({
                        method: 'get',
                        url: "https://cisco-presence.unit.ua/api/presence/v1/kpisummary/",
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
                        summary_sec.totalVisitors = response.data.totalVisitorCount
                        summary_sec.totalPasserby = response.data.totalPasserbyCount
                        summary_sec.totalConnected = response.data.totalConnectedCount
                    })
                        .catch(error => console.log('BAD', error))
                }
            }

        },
        computed: {
            chartData: function () {
                return {
                    labels: [
                        'Passerby',
                        'Visitors',
                        'Connected'
                    ],
                    datasets: [{
                        backgroundColor: [
                            '#28a745',
                            '#DC3545',
                            '#007bff'
                        ],
                        borderColor: [
                            'rgba(40,167,69,0.5)',
                            'rgba(220,53,69,0.5)',
                            'rgba(0, 123, 255, 0.5)'
                        ],
                        data: [
                            this.totalPasserby,
                            this.totalVisitors,
                            this.totalConnected
                        ]
                    }]
                }
            },
            options: function () {
                return {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Proximity Distribution'
                    }
                }
            }
        }
    }
</script>