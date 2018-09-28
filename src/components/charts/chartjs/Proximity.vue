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
        name: 'proximity',
        components: {
            BarChartJs
        },
        data() {
            return{
                passerby: {
                    labels: [],
                    values: []
                },
                visitors: {
                    labels: [],
                    values: []
                },
                connected: {
                    labels: [],
                    values: []
                }
            }
        },
        props: ['params', 'interval'],
        computed: {
            chartData: function () {
                return {
                    labels: this.passerby.labels,
                    datasets: [
                        {
                            label: 'Passerby',
                            backgroundColor: 'rgba(40,167,69,0.5)',
                            borderColor: '#28a745',
                            data: this.passerby.values
                        },
                        {
                            label: 'Visitors',
                            backgroundColor: 'rgba(220,53,69,0.5)',
                            borderColor: '#DC3545',
                            data: this.visitors.values
                        },
                        {
                            label: 'Connected',
                            backgroundColor: 'rgba(0, 123, 255, 0.5)',
                            borderColor: '#007bff',
                            data: this.connected.values
                        }
                    ]
                }
            },
            options: function () {
                return {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Proximity'
                    }
                }
            }
        },
        methods: {
            getPasserby: async function()
            {
                await axios({
                    method: 'get',
                    url: "https://cisco-presence.unit.ua/api/presence/v1/passerby/" + this.interval,
                    auth: {
                        username: 'RO',
                        password: 'Passw0rd'
                    },
                    params: this.params

                }).then(response => {
                    this.passerby.labels.length = 0;
                    this.passerby.values.length = 0;
                    for (let key in response.data) {
                        if (response.data.hasOwnProperty(key)) {
                            this.passerby.labels.push(key);
                            this.passerby.values.push(response.data[key])
                        }
                    }
                }).catch(error => console.log('BAD', error))
            },
            getVisitors: async function() {
                await axios({
                    method: 'get',
                    url: "https://cisco-presence.unit.ua/api/presence/v1/visitor/" + this.interval,
                    auth: {
                        username: 'RO',
                        password: 'Passw0rd'
                    },
                    params: this.params

                }).then(response => {
                    this.visitors.values.length = 0;
                    for (let key in response.data) {
                        if (response.data.hasOwnProperty(key)) {
                            this.visitors.values.push(response.data[key])
                        }
                    }
                }).catch(error => console.log('BAD', error))
            },
            getConnected: async function(){
                await axios({
                    method: 'get',
                    url: "https://cisco-presence.unit.ua/api/presence/v1/connected/" + this.interval,
                    auth: {
                        username: 'RO',
                        password: 'Passw0rd'
                    },
                    params: this.params

                }).then(response => {
                    this.connected.values.length = 0;
                    for (let key in response.data) {
                        if (response.data.hasOwnProperty(key)) {
                            this.connected.values.push(response.data[key])
                        }
                    }
                }).catch(error => console.log('BAD', error))
            }
        },
        watch:{
            params: async function(){
                await this.getPasserby();
                await this.getVisitors();
                await this.getConnected();
            }
        }
    }
</script>