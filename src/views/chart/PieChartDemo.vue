<template>
    <div>
        <div class="content-section introduction">
            <div class="feature-intro">
                <h1>Pie Chart</h1>
                <p>A pie chart is a circular statistical graphic, which is divided into slices to illustrate numerical proportion.</p>
            </div>
            <AppDemoActions />
        </div>

        <div class="content-section implementation">
            <div class="card">
                <Chart type="pie" :data="chartData" :options="chartOptions" />
            </div>
        </div>

        <PieChartDoc/>
    </div>
</template>

<script>
import PieChartDoc from './PieChartDoc';
import EventBus from '@/AppEventBus';

export default {
    mounted() {
        EventBus.on('change-theme', event => {
            if (event.dark)
                this.chartOptions = this.getDarkTheme();
            else
                this.chartOptions = this.getLightTheme();
        });
    },
    beforeUnmount() {
        EventBus.off('change-theme');
    },
    data() {
        return {
            chartData: {
                labels: ['A','B','C'],
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: [
                            "#42A5F5",
                            "#66BB6A",
                            "#FFA726"
                        ],
                        hoverBackgroundColor: [
                            "#64B5F6",
                            "#81C784",
                            "#FFB74D"
                        ]
                    }
                ]
            },
            chartOptions: this.isDarkTheme() ? this.getDarkTheme() : this.getLightTheme()
        }
    },
    methods: {
        isDarkTheme() {
            return this.$appState.darkTheme === true;
        },
        getLightTheme() {
            return {
                legend: {
                    labels: {
                        fontColor: '#495057'
                    }
                }
            }
        },
        getDarkTheme() {
            return {
                legend: {
                    labels: {
                        fontColor: '#ebedef'
                    }
                }
            }
        }
    },
    components: {
        'PieChartDoc': PieChartDoc
    }
}
</script>
