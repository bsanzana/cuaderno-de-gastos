import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEye,
  faPenToSquare,
  faTrash,
  faFileExcel,
  faPlus,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { Component, Input, inject } from '@angular/core';
import { ButtonModule } from '@coreui/angular-pro';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';

const KEYS_COSTOS = {
  maquinarias: '',
  insumos: '',
  mano_de_obra: '',
  otros_costos: '',
};
@Component({
  selector: 'app-descargar-sabana',
  standalone: true,
  imports: [FontAwesomeModule, ButtonModule],
  templateUrl: './descargar-sabana.component.html',
  providers: [ExcelService],
})
export class DescargarSabanaComponent {
  faDownload = faDownload;
  excelService = inject(ExcelService);
  @Input() cuadernos: any;
  ngOnInit(): void {}

  exportarSababa() {
    const totales = this.calcularTotales();
    this.excelService.exportSabana(this.cuadernos, totales);
  }

  calcularTotales() {
    let sumaTotalesPorCuaderno: any = []
    this.cuadernos.forEach((element: any) => {
      const sumaTotales: any = {};
      for (const key in KEYS_COSTOS) {
        const totalCostSum = element[key].reduce(
          (acc: any, item: any) => acc + item.total_cost,
          0
        );
        const totalCostHaSum = element[key].reduce(
          (acc: any, item: any) => acc + item.total_cost_ha,
          0
        );
        sumaTotales[key] = {
          total_cost: totalCostSum,
          total_cost_ha: totalCostHaSum,
        };
      }
      sumaTotalesPorCuaderno.push({ _id: element._id, ...sumaTotales });
    });

    return sumaTotalesPorCuaderno;
  }
}
