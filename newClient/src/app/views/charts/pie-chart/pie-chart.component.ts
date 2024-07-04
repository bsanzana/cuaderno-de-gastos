
import { Component, Input } from '@angular/core';
import { BaseChartDirective,  } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html'
})
export class PieChartComponent {

  @Input() data: any;
  @Input() type: any;
  @Input() title: any;
  @Input() legend: any;

  chartOptions: any;
  chartLegend: any;
  chartPlugins: any;
  ngOnInit(): void {

    Chart.register(...registerables, DataLabelsPlugin);

    this.chartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: this.title,
        },
        datalabels: {
          formatter: (value: any, context: any) => {
            const dataSet = context.chart.data.datasets[0];
            const total = dataSet.data.reduce(
              (prevValue: any, currentValue: any) => prevValue + currentValue,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return percentage + '%';
          },
          color: '#fff',
        },
      },
    };

    this.chartLegend = this.legend;
    this.chartPlugins = [DataLabelsPlugin];

  }

}
