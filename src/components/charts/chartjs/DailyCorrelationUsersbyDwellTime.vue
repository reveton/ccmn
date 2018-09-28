<template>
    <div class="animated fadeIn">
            <div class="chart-wrapper">
                <bar-chart-js
                        :chart-data="chartData"
                        :options="options"
                        :height="400"    />
            </div>
    </div>
</template>

<script>
    import BarChartJs from './scripts/BarChartJs.vue';
    import axios from 'axios'
    import moment from 'moment'

    export default {
        name: 'daily-correlation-users-by-dwell-time',
        components: {
            BarChartJs
        },
        data() {
            return{
                connectedUsersBySession: [],
                shortestDwell: [],
                shortDwell: [],
                middleDwell: [],
                longDwell: [],
                longestDwell: []
            }
        },
        props: ['site'],
        watch: {
            site: async function () {
                await this.getInfo()
            }
        },
        computed: {
            chartData: function () {
                return {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: '5-30 mins',
                            backgroundColor: 'rgba(40,167,69,0.5)',
                            borderColor: '#28a745',
                            data: this.shortestDwell
                        },
                        {
                            label: '30-60 mins',
                            backgroundColor: 'rgba(220,53,69,0.5)',
                            borderColor: '#DC3545',
                            data: this.shortDwell
                        },
                        {
                            label: '1-5 hours',
                            backgroundColor: 'rgba(0, 123, 255, 0.5)',
                            borderColor: '#007bff',
                            data: this.middleDwell
                        },
                        {
                            label: '5-8 hours',
                            backgroundColor: 'rgba(255,193,7,0.5)',
                            borderColor: '#FFC107',
                            data: this.longDwell
                        },
                        {
                            label: '8+ hours',
                            backgroundColor: 'rgba(23,162,184,0.5)',
                            borderColor: '#17a2b8',
                            data: this.longestDwell
                        }
                    ]
                }
            },
            options: function () {
                return {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Daily Correlation Visitor Dwell Time by Dwell Level'
                    },
                    scales: {
                        xAxes: [{
                            stacked: true
                        }],
                    }
                }
            }
        },
        methods:{
            getInfo: async function(){
                axios({
                    method: 'get',
                    url: "https://cisco-presence.unit.ua/api/presence/v1/dwell/dailyaverage",
                    auth: {
                        username: 'RO',
                        password: 'Passw0rd'
                    },
                    params: {
                        siteId: this.site,
                        startDate: moment().subtract(3, 'months').format('YYYY-MM-DD'),
                        endDate: moment().format('YYYY-MM-DD')
                    }

                }).then(response => {
                    let i = 0;
                    this.connectedUsersBySession = [0, 0, 0, 0, 0, 0, 0];
                    for (let key in response.data) {
                        if (!this.connectedUsersBySession[moment(key).day()]) {
                            this.connectedUsersBySession[moment(key).day()] = [];
                        }
                        for (let k in response.data[key]) {
                            if (!this.connectedUsersBySession[moment(key).day()][k]) {
                                this.connectedUsersBySession[moment(key).day()][k] = 0;
                            }
                            this.connectedUsersBySession[moment(key).day()][k] += response.data[key][k];
                        }
                        i++
                    }
                    for (let key in this.connectedUsersBySession) {
                        let arrays = Object.entries(this.connectedUsersBySession[key]);
                        for (let k in arrays) {
                            arrays[k][0] === 'FIVE_TO_THIRTY_MINUTES' ? this.shortestDwell.push(Math.floor(arrays[k][1] / (i / 7))) : 0;
                            arrays[k][0] === 'THIRTY_TO_SIXTY_MINUTES' ? this.shortDwell.push(Math.floor(arrays[k][1] / (i / 7))) : 0;
                            arrays[k][0] === 'ONE_TO_FIVE_HOURS' ? this.middleDwell.push(Math.floor(arrays[k][1] / (i / 7))) : 0;
                            arrays[k][0] === 'FIVE_TO_EIGHT_HOURS' ? this.longDwell.push(Math.floor(arrays[k][1] / (i / 7))) : 0;
                            arrays[k][0] === 'EIGHT_PLUS_HOURS' ? this.longestDwell.push(Math.floor(arrays[k][1] / (i / 7))) : 0;
                        }
                    }
                    this.loaded = true;
                })
                    .catch(error => console.log('BAD', error))
            }
        }
    }
</script>