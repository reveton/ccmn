<template>
    <div class="animated fadeIn">
        <div class="chart-wrapper">
            <line-chart-js
                    :chart-data="chartData"
                    :options="options"
                    :height="400"    />
        </div>
    </div>
</template>

<script>
    import LineChartJs from './scripts/LineChartJs.vue';
    import axios from 'axios'
    import moment from 'moment'

    export default {
        name: 'repeat-visitors',
        components: {
            LineChartJs
        },
        data() {
            return{
                labels: [],
                daily: [],
                weekly: [],
                occasional: [],
                firstTime: [],
                yesterday: []
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
                            label: 'Daily',
                            backgroundColor: 'rgba(40,167,69,0.5)',
                            borderColor: '#28a745',
                            data: this.daily
                        },
                        {
                            label: 'Weekly',
                            backgroundColor: 'rgba(220,53,69,0.5)',
                            borderColor: '#DC3545',
                            data: this.weekly
                        },
                        {
                            label: 'Occasional',
                            backgroundColor: 'rgba(0, 123, 255, 0.5)',
                            borderColor: '#007bff',
                            data: this.occasional
                        },
                        {
                            label: 'First Time',
                            backgroundColor: 'rgba(255,193,7,0.5)',
                            borderColor: '#FFC107',
                            data: this.firstTime
                        },
                        {
                            label: 'Yesterday',
                            backgroundColor: 'rgba(23,162,184,0.5)',
                            borderColor: '#17a2b8',
                            data: this.yesterday
                        }
                    ]
                }
            },
            options: function () {
                return {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Repeat Visitors'
                    }
                }
            }
        },
        methods:{
            getInfo: async function(){
                axios({
                    method: 'get',
                    url: "https://cisco-presence.unit.ua/api/presence/v1/repeatvisitors/" + this.interval,
                    auth: {
                        username: 'RO',
                        password: 'Passw0rd'
                    },
                    params: this.params

                }).then(response => {
                    this.labels.length = 0;
                    this.daily.length = 0;
                    this.weekly.length = 0;
                    this.occasional.length = 0;
                    this.firstTime.length = 0;
                    this.yesterday.length = 0;
                    this.connectedUsers = [0, 0, 0, 0, 0, 0, 0];
                    for (let key in response.data) {
                        if (response.data.hasOwnProperty(key)) {
                            this.labels.push(key);
                            this.daily.push(response.data[key].DAILY ? response.data[key].DAILY : 0);
                            this.weekly.push(response.data[key].WEEKLY ? response.data[key].WEEKLY : 0);
                            this.occasional.push(response.data[key].OCCASIONAL ? response.data[key].OCCASIONAL : 0);
                            this.firstTime.push(response.data[key].FIRST_TIME ? response.data[key].FIRST_TIME : 0);
                            this.yesterday.push(response.data[key].YESTERDAY ? response.data[key].YESTERDAY : 0)
                        }
                    }
                }).catch(error => console.log('BAD', error))
            }
        }
    }
</script>