<template>
    <div class="row">
        <div v-if="!loaded" class="parent" >
            <div class="block">
                <pulse-loader :loading="true" color="#43a5f5" size="50px"></pulse-loader>
            </div>
        </div>
        <div class="col-sm-12 custom-date">
            <div class="date-align">
                <date-picker :input-class="'form-control'" :first-day-of-week="1" :not-after="new Date()" v-model="date"
                             lang="en" range :shortcuts="shortcuts"></date-picker>
            </div>
        </div>
        <info
            icon="icon-lg pe-7f-users"
            bgclass="bg-flat-color-3"
            v-if="loaded" :counter="total_visitors"
            title="Total Visitors"
        >
        </info>
        <info
            icon="icon-lg pe-7f-clock"
            bgclass="bg-flat-color-1"
            symbol="mins"
            v-if="loaded" :counter="average_dwell_time"
            title="Average Dwell Time"
        >
        </info>
        <info
                icon="icon-lg pe-7f-monitor"
                bgclass="bg-flat-color-4"
                hasApple="yes"
                :maker="topMaker"
                v-if="loaded"
                title="Top Device Maker"
        >
        </info>

        <info-chart
            icon="icon-lg pe-7f-cart"
            symbol="%"
            hasPercentage="yes"
            bgclass="bg-flat-color-6"
            v-if="loaded" :counter="conversion_rate"
            canvasId="flotBar1"
            title="Conversion Rate"
        >
        </info-chart>

        <info-chart-two
            icon="icon-lg pe-7f-cart"
            bgclass="bg-flat-color-2"
            v-if="loaded" :counter="peak_hour"
            canvasId="flotLine1"
            title="Peak Hour"
        >
        </info-chart-two>

        <div class="col-sm-6">
            <card header-text="Proximity" class="mb-4">
                <div class="chart-wrapper mb-4" >
                    <proximity :params="params" :interval="interval" style="height: 376px;"/>
                </div>
            </card>
        </div>
        <div class="col-sm-6">
            <card header-text="Proximity Distribution">
                <div class="chart-wrapper">
                    <proximity-distribution :params="params"/>
                </div>
            </card>
        </div>
        <div class="col-sm-6">
            <card header-text="Dwell Time" class="mb-4">
                <div class="chart-wrapper mb-4" >
                    <dwell-time :params="params" :interval="interval" style="height: 376px;"/>
                </div>
            </card>
        </div>
        <div class="col-sm-6">
            <card header-text="Dwell Time Distribution">
                <div class="chart-wrapper">
                    <dwell-time-distribution :params="params" />
                </div>
            </card>
        </div>
        <div class="col-sm-6">
            <card header-text="Repeat Visitors">
                <div class="chart-wrapper">
                    <repeat-visitors :params="params" :interval="interval" />
                </div>
            </card>
        </div>
        <div class="col-sm-6">
            <card header-text="Repeat Visitors Distribution">
                <div class="chart-wrapper">
                    <repeat-visitors-distribution :params="params" />
                </div>
            </card>
        </div>
        <div class="col-sm-12">
            <card header-text="Daily Correlation Users by Connected Users" class="mb-4">
                <div class="chart-wrapper mb-4" >
                    <connected-users :site="site" />
                </div>
            </card>
        </div>
        <div class="col-sm-12">
            <card header-text="Daily Correlation Users by Dwell Time" class="mb-4">
                <div class="chart-wrapper mb-4" >
                    <users-dwell-time :site="site"/>
                </div>
            </card>
        </div>

    </div>

</template>

<script>
//Loader
import { PulseLoader } from 'vue-spinner/dist/vue-spinner.min';
// Charts
import Info from './dashboard/InfoBox.vue';
import InfoChart from './dashboard/InfoBoxChart.vue';
import InfoChartTwo from './dashboard/InfoBoxChart2.vue';
import usersDwellTime from '../components/charts/chartjs/DailyCorrelationUsersbyDwellTime.vue'
import ConnectedUsers from '../components/charts/chartjs/DailyCorrelationUsersbyConnectedUsers.vue'
import RepeatVisitors from '../components/charts/chartjs/RepeatVisitors.vue'
import RepeatVisitorsDistribution from '../components/charts/chartjs/RepeatVisitorsDistribution.vue'
import DwellTime from '../components/charts/chartjs/DwellTime.vue'
import DwellTimeDistribution from '../components/charts/chartjs/DwellTimeDistribution.vue'
import Proximity from '../components/charts/chartjs/Proximity.vue'
import ProximityDistribution from '../components/charts/chartjs/ProximityDistribution.vue'


// Get Api Data
import axios from 'axios';
// Date
import DatePicker from 'vue2-datepicker'
import moment from 'moment'



export default {
    name: 'dashboard',
    components: {
        Info,
        InfoChart,
        InfoChartTwo,
        DatePicker,
        PulseLoader,
        usersDwellTime,
        ConnectedUsers,
        RepeatVisitors,
        RepeatVisitorsDistribution,
        DwellTime,
        DwellTimeDistribution,
        Proximity,
        ProximityDistribution
    },
    data() {
        return {
            date: [new Date(), new Date()],
            interval: 'hourly',
            shortcuts: [
                {
                    text: 'Today',
                    onClick: () => {
                        this.date = [new Date(), new Date()]
                        this.interval = 'hourly'
                    }
                },
                {
                    text: 'Yesterday',
                    onClick: () => {
                        this.date = [new Date(Date.now() - 24 * 60 * 60 * 1000), new Date(Date.now() - 24 * 60 * 60 * 1000)]
                        this.interval = 'hourly'
                    }
                },
                {
                    text: 'Last week',
                    onClick: () => {
                        this.date = [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()]
                        this.interval = 'daily'
                    }
                },
                {
                    text: 'Last month',
                    onClick: () => {
                        this.date = [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()]
                        this.interval = 'daily'
                    }
                }
            ],
            lang: {
                days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
                placeholder: {
                    date: 'Select Date',
                    dateRange: 'Select Date Range'
                }
            },
            site: null,
            sitesArray: [],
            total_visitors: null,
            loaded: false,
            average_dwell_time: null,
            conversion_rate: null,
            peak_hour: null,
            startDate: null,
            endDate: null,
            totalPasserby: null,
            totalConnected: null,
            topMaker: null
        }
    },
    beforeCreate() {
        let arr = this
        axios({
            method: 'get',
            url: "https://cisco-presence.unit.ua/api/config/v1/sites",
            auth: {
                username: 'RO',
                password: 'Passw0rd'
            }
        }).then(response => {
            response.data.forEach(function (el) {
                arr.sitesArray.push({
                    value: el.aesUId,
                    name: el.name
                })
            });
            this.site = this.sitesArray[0].value
        })
            .catch(error => console.log('ERROR', error))
    },
    methods: {
        getSummaryInfo() {
            let summary = this
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
                    summary.total_visitors = response.data.totalVisitorCount
                    summary.average_dwell_time = response.data.averageDwell.toFixed(0)
                    summary.conversion_rate = response.data.conversionRate.toFixed(0)
                    summary.peak_hour = response.data.peakSummary.peakHourCount.toFixed(0)
                    summary.totalPasserby = response.data.totalPasserbyCount
                    summary.totalConnected = response.data.totalConnectedCount
                    summary.topMaker = response.data.topManufacturers.name
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
                    summary.total_visitors = response.data.totalVisitorCount
                    summary.totalPasserby = response.data.totalPasserbyCount
                    summary.totalConnected = response.data.totalConnectedCount
                    summary.average_dwell_time = response.data.averageDwell.toFixed(0)
                    summary.conversion_rate = response.data.conversionRate.toFixed(0)
                    summary.peak_hour = response.data.peakWeekSummary.peakHourCount
                    summary.topMaker = response.data.topManufacturers.name
                    this.loaded = true;
                })
                    .catch(error => console.log('BAD', error))
            }
            this.loaded = false;
        }
    },
    watch: {
        site: function () {
            this.getSummaryInfo()
        },
        date:function(){
            this.getSummaryInfo()
        }
    },
    computed: {
        params: function() {
            let params = {
                siteId: this.site,
                startDate: moment(this.date[0]).format('YYYY-MM-DD'),
                endDate: moment(this.date[1]).format('YYYY-MM-DD')
            };
            if (moment(this.date[0]).format('YYYY-MM-DD') === moment(this.date[1]).format('YYYY-MM-DD') || this.interval === 'hourly') {
                params.date = moment(this.date[1]).format('YYYY-MM-DD')
            }
            return params
        }
    }
}
</script>

<style>
    .custom-date svg {
        height: 26px;
    }
    .custom-date {
        margin-bottom: 30px;
    }
    .date-align {
        text-align: right;
    }
    .parent {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        overflow: auto;
        z-index: 100;
        background: #eeeeeed1
    }
</style>