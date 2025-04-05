
import { LightningElement, api, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartjs';

export default class ChartWrapper extends LightningElement {
    @api chartTitle;
    @api chartData;
    @api chartType = 'bar'; // default type
    @api chartHeight = 300;
    
    @track chartInitialized = false;
    chart;
    chartConfig;
    error;
    
    renderedCallback() {
        if (this.chartInitialized) {
            return;
        }
        
        if (this.chartData) {
            loadScript(this, chartjs)
                .then(() => {
                    this.initializeChart();
                    this.chartInitialized = true;
                })
                .catch(error => {
                    this.error = error;
                });
        }
    }
    
    initializeChart() {
        const canvas = this.template.querySelector('canvas');
        const context = canvas.getContext('2d');
        
        // Prepare the chart data structure based on chartType
        switch(this.chartType) {
            case 'donut':
            case 'pie':
                this.chartConfig = this.preparePieChartConfig();
                break;
            case 'bar':
                this.chartConfig = this.prepareBarChartConfig();
                break;
            case 'line':
                this.chartConfig = this.prepareLineChartConfig();
                break;
            default:
                this.chartConfig = this.prepareBarChartConfig();
        }
        
        // Create the chart
        this.chart = new window.Chart(context, this.chartConfig);
    }
    
    preparePieChartConfig() {
        const labels = this.chartData.map(item => item.label);
        const data = this.chartData.map(item => item.value);
        const colors = this.chartData.map(item => item.color || this.getRandomColor());
        
        return {
            type: this.chartType === 'donut' ? 'doughnut' : 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'right'
                },
                title: {
                    display: !!this.chartTitle,
                    text: this.chartTitle
                }
            }
        };
    }
    
    prepareBarChartConfig() {
        const labels = this.chartData.map(item => item.label);
        const data = this.chartData.map(item => item.value);
        const colors = this.chartData.map(item => item.color || this.getRandomColor());
        
        return {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: this.chartTitle || 'Data',
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: !!this.chartTitle,
                    text: this.chartTitle
                }
            }
        };
    }
    
    prepareLineChartConfig() {
        const labels = this.chartData.map(item => item.label);
        const data = this.chartData.map(item => item.value);
        
        return {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: this.chartTitle || 'Data',
                    data: data,
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: !!this.chartTitle,
                    text: this.chartTitle
                }
            }
        };
    }
    
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    @api
    updateChart(newData) {
        if (this.chart && newData) {
            if (this.chartType === 'donut' || this.chartType === 'pie') {
                this.chart.data.labels = newData.map(item => item.label);
                this.chart.data.datasets[0].data = newData.map(item => item.value);
                this.chart.data.datasets[0].backgroundColor = newData.map(
                    item => item.color || this.getRandomColor()
                );
            } else {
                this.chart.data.labels = newData.map(item => item.label);
                this.chart.data.datasets[0].data = newData.map(item => item.value);
            }
            this.chart.update();
        }
    }
}
