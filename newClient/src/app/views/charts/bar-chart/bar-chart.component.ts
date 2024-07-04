import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent {
  @Input() data: any;
  @Input() type: any;
  @Input() title: any;
  @Input() legend: any;
  @Input() xAxisLabel: any;
  @Input() yAxisLabel: any;

  chartOptions: any;
  chartLegend: any;
  chartPlugins: any;

  ngOnInit(): void {
    this.chartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: this.title,
        },
        datalabels: {
          anchor: 'end',
          align: 'end',
          formatter: (value: any) => value,
          color: '#444',
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: this.xAxisLabel,
          },
          
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: this.yAxisLabel,
          },
          ticks: {
            stepSize: 1,
          },
        },
      },
    };

    this.chartLegend = this.legend;
    this.chartPlugins = [DataLabelsPlugin];
  }
}
