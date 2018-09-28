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
        name: 'daily-correlation-users-by-connected-users',
        components: {
            BarChartJs
        },
        data() {
            return{
                connectedUsers: []
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
                            label: 'Connected Users',
                            backgroundColor: 'rgba(40,167,69,0.5)',
                            borderColor: '#28a745',
                            data: this.connectedUsers
                        }
                    ]
                }
            },
            options: function () {
                return {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Daily Correlation Users by Connected Users'
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
                    url: "https://cisco-presence.unit.ua/api/presence/v1/connected/daily",
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
                    this.connectedUsers = [0, 0, 0, 0, 0, 0, 0];
                    for (let key in response.data) {
                        this.connectedUsers[moment(key).day()] += response.data[key];
                        i++
                    }
                    Object.keys(this.connectedUsers).map((key, index) => {
                        this.connectedUsers[key] = Math.floor(this.connectedUsers[key] / (i / 7));
                    })
                }).catch(error => console.log('BAD', error))
            }
        }
    }
</script>