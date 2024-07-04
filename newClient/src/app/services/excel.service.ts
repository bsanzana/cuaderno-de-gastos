import { DatePipe } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { fill } from 'lodash-es';
//import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx-js-style';
import * as FileSaver from 'file-saver';

import { environment } from '../../environments/environment';
const ENDPOINT_AVATAR_IMAGE = environment.apiURL + '/api/v1/assets/avatar/';
const ENDPOINT_LOGO_IMAGE = environment.apiURL + '/api/v1/assets/logo/';
const ENDPOINT_FIRMA_IMAGE = environment.apiURL + '/api/v1/assets/firma/';
const LETRAS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const LETRASM = LETRAS.map((letra) => letra.toUpperCase());
@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  datePipe = inject(DatePipe);

  centeredStyle: any = {
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  };
  borderStyle: any = {
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  };

  itemsStyle: any = {
    font: {
      color: { rgb: 'FFFFFFFF' },
      bold: true, // Letras blancas
    },
    fill: {
      fgColor: { rgb: '0455AD' }, // Fondo azul
    },
    ...this.borderStyle,
  };

  boldStyle: any = {
    font: {
      bold: true,
    },
    ...this.borderStyle,
  };

  titutloStyle: any = {
    font: {
      bold: true,
      size: 22,
    },
    ...this.borderStyle,
  };

  subitemsStyle: any = {
    font: {
      color: { rgb: 'FFFFFFFF' },
      bold: true, // Letras blancas
    },
    fill: {
      fgColor: { rgb: '6C7176' }, // Fondo azul
    },
    ...this.borderStyle,
  };

  totalStyle: any = {
    font: {
      //color: { rgb: 'FFFFFFFF' },
      bold: true, // Letras blancas
    },
    fill: {
      fgColor: { rgb: 'B3CDE0' }, // Fondo azul
    },
    ...this.borderStyle,
  };

  resumenStyle: any = {
    font: {
      color: { rgb: 'FFFFFFFF' },
      bold: true, // Letras blancas
    },
    fill: {
      fgColor: { rgb: '011f4b' }, // Fondo azul
    },
    ...this.borderStyle,
  };

  infoStyle: any = {
    font: {
      color: { rgb: 'FFFFFFFF' },
      bold: true, // Letras blancas
    },
    fill: {
      fgColor: { rgb: '03396c' }, // Fondo azul
    },
    ...this.borderStyle,
  };

  constructor() {}

  async excelTest(
    data: any[],
    encabezado: any,
    resumenContable: any,
    titulo: any,
    pathImages: any
  ) {
    let rowIndex = 1;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const pathLogo = pathImages.logo;
    if (pathImages.logo) {
      let imageBuffer = await this.getImageBuffer(
        ENDPOINT_LOGO_IMAGE + pathLogo
      );

      let ext = pathLogo.split('.');
      let imageId = workbook.addImage({
        base64: imageBuffer!,
        extension: ext[ext.length - 1], // Cambiar a 'jpeg' si es necesario
      });

      // Insertar la imagen en la celda B2
      worksheet.addImage(imageId, {
        tl: { col: 0, row: rowIndex - 1 },
        ext: { width: 100, height: 100 },
      });
      rowIndex++;
    }

    // Agregar encabezado información básica del productor + análisis
    worksheet.mergeCells(`B${rowIndex}:D${rowIndex}`);
    // Agrega texto a la celda combinada
    let title = worksheet.getCell(`B${rowIndex}`);
    title.value = `FICHA DE COSTO ${titulo.type_crop} ${titulo.season}`;
    // Estilo de negrita, tamaño de letra 22 y centrado
    title.font = { bold: true, size: 22 };
    title.alignment = { vertical: 'middle', horizontal: 'center' };
    //title.border = this.borderStyle.border
    rowIndex++;

    let rowInfo = 6;
    worksheet.mergeCells(`A${rowInfo}:B${rowInfo}`);
    // Agrega texto a la celda combinada
    let cell = worksheet.getCell(`A${rowInfo}`);
    cell.value = `INFORMACIÓN DEL PRODUCTOR`;
    // Estilo de negrita, tamaño de letra 22 y centrado
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0070C0' }, // Fondo azul
    };
    cell.border = this.borderStyle.border;

    rowInfo++;
    Object.entries(encabezado).forEach(([key, value]) => {
      const row = worksheet.addRow([key, value]);
      row.getCell(1).font = { bold: true };
      row.getCell(1).border = this.borderStyle.border;
      row.getCell(2).border = this.borderStyle.border;
      rowInfo++;
    });

    rowIndex = rowInfo;
    let rowResumen = 6;
    worksheet.mergeCells(`D${rowResumen}:E${rowResumen}`);
    // Agrega texto a la celda combinada
    cell = worksheet.getCell(`D${rowResumen}`);
    cell.value = `RESUMEN CONTABLE`;
    // Estilo de negrita, tamaño de letra 22 y centrado
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0070C0' }, // Fondo azul
    };
    cell.border = this.borderStyle.border;

    rowResumen++;
    Object.entries(resumenContable).forEach(([key, value]) => {
      const cellD = worksheet.getCell(`D${rowResumen}`); // Columna D
      const cellE = worksheet.getCell(`E${rowResumen}`); // Columna E
      cellD.value = key;

      cellD.font = { bold: true };
      cellD.border = this.borderStyle.border;

      cellE.value = value as any;
      cellE.border = this.borderStyle.border;
      rowResumen++;
    });

    rowIndex++;

    const headers = [
      'Epoca',
      'Cantidad',
      'Unidad',
      'Costo',
      'Costo/ha',
      'Costo total',
    ];
    data.forEach((element: any, index: number) => {
      const value = [...[`${element[0].item} (${LETRAS[index]})`], ...headers];

      value.forEach((val, colIndex) => {
        const cell = worksheet.getCell(`${LETRASM[colIndex]}${rowIndex}`);
        cell.value = val;
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '0070C0' }, // Fondo azul
        };
        cell.border = this.borderStyle.border;
      });
      rowIndex++;
      // Iterar sobre cada conjunto de datos (omitimos el primer elemento que es el item)
      const totalItem = element.slice(-1)[0];

      element.slice(1, -1).forEach((set: any[], index: number) => {
        // Añadir la fila labores (subitems)
        let cell = worksheet.getCell(`${LETRASM[0]}${rowIndex}`);
        cell.value = set[0].subitem;
        cell.border = this.borderStyle.border;
        cell.font = { bold: true, color: { argb: 'ff000000' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ff91d2ff' }, // Fondo azul
        };
        rowIndex++;

        var totalSubItem = set.slice(-1)[0];
        //Añadir los datos de "Nombre" y "Epoca", etc
        set.slice(1, -1).forEach((item) => {
          Object.values(item).forEach((val: any, colIndex) => {
            let cell = worksheet.getCell(`${LETRASM[colIndex]}${rowIndex}`);
            cell.value = val;
            cell.border = this.borderStyle.border;
          });
          rowIndex++;
        });

        ['Subtotal: ', ...Object.values(totalSubItem)].forEach(
          (val: any, colIndex) => {
            let cell = worksheet.getCell(`${LETRASM[colIndex + 4]}${rowIndex}`);
            cell.value = val;
            cell.border = this.borderStyle.border;
            cell.font = { bold: true, color: { argb: 'ff000000' } };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ff91d2ff' }, // Fondo azul
            };
            cell.numFmt = '"$"#,##0.00';
          }
        );
        rowIndex++;
      });
      ['Total: ', ...Object.values(totalItem)].forEach((val: any, colIndex) => {
        let cell = worksheet.getCell(`${LETRASM[colIndex + 4]}${rowIndex}`);
        cell.value = val;
        cell.border = this.borderStyle.border;
        cell.font = { bold: true, color: { argb: 'ff000000' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ff91d2ff' }, // Fondo azul
        };
        cell.numFmt = '"$"#,##0.00';
      });
      rowIndex++;
    });
    // Calcular el ancho óptimo para cada columna
    worksheet.columns.forEach((column: any) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell: any) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    // Calcular la altura óptima para cada fila
    worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
      let maxHeight = 15; // Altura mínima para una fila
      row.eachCell((cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        const lines = cellValue.split('\n').length;
        const cellHeight = lines * 20;
        if (cellHeight > maxHeight) {
          maxHeight = cellHeight;
        }
      });
      worksheet.getRow(rowIndex).height = maxHeight;
    });

    if (pathImages.firma) {
      let pathFirma = pathImages.firma;
      let imageBuffer = await this.getImageBuffer(
        ENDPOINT_FIRMA_IMAGE + pathFirma
      );

      let ext = pathFirma.split('.');
      let imageId = workbook.addImage({
        base64: imageBuffer!,
        extension: ext[ext.length - 1], // Cambiar a 'jpeg' si es necesario
      });

      // Insertar la imagen en la celda B2
      worksheet.addImage(imageId, {
        tl: { col: 2, row: rowIndex + 2 },
        ext: { width: 900, height: 300 },
      });
      rowIndex++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    FileSaver.saveAs(
      new Blob([buffer]),
      `FICHA-DE-COSTO_${titulo.type_crop}_${titulo.season}_${encabezado['Nombre del productor']}.xlsx`
    );
  }

  private async getImageBuffer(url: string): Promise<string | null> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          // Remover el prefijo 'data:image/png;base64,'
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  }
  exportSabana(cuadernos: any, totales: any) {
    console.log(cuadernos, totales);

    const headers = [
      'Nombres',
      'Apellidos',
      'RUT',
      'Nacimiento',
      'Género',
      'Dirección',
      'Unidad operativa',
      'Actividad SII',
      'Superficie total',
      'Superficie Cultivada',
      'Tenencia',
      'Temporada',
      'Análisis de suelo',
      'Seguro Agricola',
      'Tipo de cultivo',
      'Variedad',
      'Tipo de semilla',
      'Fecha de siembra',
      'Fecha de Cosecha',
      'Sistema de riego',
      'Observaciones',
      'Tenencia',
      'Fuente de energía',
      'Fuente de agua',
      'Industria',
      'Limpio seco',
      'Limpio seco por ha',
      'Peso bruto',
      'Peso bruto por ha',
      'Precio venta',
      'Maquinaria costo total',
      'Maquinaria costo total por ha',
      'Insumos costo total',
      'Insumos costo total por ha',
      'Mano de obra costo total',
      'Mano de obra costo total por ha',
      'Otros costos costo total',
      'Otros costos costo total por ha',
    ];
    ////////////////////////// CREANDO HOJA VACIA //////////////////////////
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
    let rowIndex = 1;
    XLSX.utils.sheet_add_aoa(worksheet, [headers], {
      origin: `A${rowIndex}`,
    });

    headers.forEach((element: any, colIndex: any) => {
      var cellAddress = XLSX.utils.encode_cell({
        r: rowIndex - 1,
        c: colIndex,
      });
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = {
          v: headers,
        };
      }
      worksheet[cellAddress].s = this.boldStyle;
    });
    rowIndex++;
    cuadernos.forEach((cuaderno: any, colIndex: any) => {
      const index = totales.findIndex((item: any) => item._id === cuaderno._id);

      if (index !== -1) {
        const dataPorFila = [
          cuaderno.informacion_del_campo.company.name,
          cuaderno.informacion_del_campo.company.lastname,
          cuaderno.informacion_del_campo.company.rut,
          this.formatearDate(cuaderno.informacion_del_campo.company.birth_date),
          cuaderno.informacion_del_campo.company.gender,
          this.crearDirecccion(
            cuaderno.informacion_del_campo.company.fields,
            cuaderno.informacion_del_campo.company_field
          ),
          cuaderno.informacion_del_campo.company.group.name,
          cuaderno.informacion_del_campo.activities_sii ? 'SI' : 'NO',
          cuaderno.informacion_del_campo.total_ha,
          cuaderno.informacion_del_campo.cultivated_area,
          cuaderno.informacion_del_campo.possession,
          cuaderno.informacion_del_campo.season.name,
          cuaderno.informacion_del_campo.soil_analysis ? 'SI' : 'NO',
          cuaderno.informacion_del_campo.crop.agricultural_insurance
            ? 'SI'
            : 'NO',
          cuaderno.informacion_del_campo.crop.type_crop?.name,
          cuaderno.informacion_del_campo.crop.variety?.name,
          cuaderno.informacion_del_campo.crop.seed_type?.name,
          this.formatearDate(
            cuaderno.informacion_del_campo.crop?.fecha_siembra
          ),
          this.formatearDate(
            cuaderno.informacion_del_campo.crop?.fecha_cosecha
          ),
          cuaderno.informacion_del_campo.water.irrigation_system,
          cuaderno.informacion_del_campo.water.obs,
          cuaderno.informacion_del_campo.water.possession,
          cuaderno.informacion_del_campo.water.power_source,
          cuaderno.informacion_del_campo.water.water_source,
          cuaderno.guia_analisis?.industria,
          cuaderno.guia_analisis?.limpioSeco,
          cuaderno.guia_analisis?.limpioSecoHA,
          cuaderno.guia_analisis?.pesoBruto,
          cuaderno.guia_analisis?.pesoBrutoHA,
          cuaderno.guia_analisis?.precioVenta,
          totales[index].maquinarias.total_cost,
          totales[index].maquinarias.total_cost_ha,
          totales[index].insumos.total_cost,
          totales[index].insumos.total_cost_ha,
          totales[index].mano_de_obra.total_cost,
          totales[index].mano_de_obra.total_cost_ha,
          totales[index].otros_costos.total_cost,
          totales[index].otros_costos.total_cost_ha,
        ];

        XLSX.utils.sheet_add_aoa(worksheet, [dataPorFila], {
          origin: `A${rowIndex}`,
        });
        var cellAddress = XLSX.utils.encode_cell({ r: rowIndex - 1, c: 0 });
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = {
            v: dataPorFila,
          };
        }
        worksheet[cellAddress].s = this.borderStyle;

        rowIndex++;
      }
    });

    // Calcular el ancho óptimo para cada columna
    const colWidths = [];
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxWidth = 10; // Ancho mínimo para una columna
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          const cellValue = cell.v.toString();
          const cellWidth = cellValue.length;
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
          }
        }
      }
      colWidths.push({ width: maxWidth });
    }
    worksheet['!cols'] = colWidths;

    // Establecer la altura de la primera fila (indexada desde 0, por lo que fila 1 es el índice 0)
    worksheet['!rows'] = [
      { hpt: 20 }, // Altura de la primera fila en puntos
    ];

    // Crear un libro de trabajo y agregar la hoja de trabajo
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Escribir el archivo Excel
    XLSX.writeFile(workbook, `todos_cuadernos.xlsx`);
  }

  crearDirecccion(direccion: any, id: any) {
    let value = '';
    //console.log('direccion y id:', direccion,id);
    const index = direccion.findIndex((item: any) => item._id === id);
    if (index !== -1) {
      //console.log('direccion:', direccion[index]);
      value = `${direccion[index].name} ${direccion[index].sector} ${direccion[index].rol}`;
    }
    return value;
  }

  formatearDate(date: any) {
    let newDate = date;
    if (date != null) {
      newDate = this.datePipe.transform(date, 'yyyy-MM-dd', '+000');
    }

    return newDate;
  }
  exportAsExcelFile(
    data: any[],
    encabezado: any,
    resumenContable: any,
    titulo: any,
    pathImages: any
  ): void {
    ////////////////////////// CREANDO HOJA VACIA //////////////////////////
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    let rowIndex = 1;

    const imagePath = ENDPOINT_AVATAR_IMAGE + pathImages.avatar;
    const ext = pathImages.avatar.split('.');

    // Agregar encabezado información basica del productor + analisis
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`FICHA DE COSTO ${titulo.type_crop} ${titulo.season}`]],
      {
        origin: `A${rowIndex}`,
      }
    );
    var cellAddress = XLSX.utils.encode_cell({ r: rowIndex - 1, c: 0 });
    if (!worksheet[cellAddress]) {
      worksheet[cellAddress] = {
        v: [`FICHA DE COSTO ${titulo.type_crop} ${titulo.season}`],
      };
    }
    worksheet[cellAddress].s = { ...this.titutloStyle, ...this.centeredStyle };
    // Fusionar celdas A1 y B1
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({
      s: { r: 0, c: 0 },
      e: { r: 0, c: 6 },
    });

    rowIndex++;
    rowIndex++;

    let rowResumenContable = rowIndex;
    // Agregar encabezado información basica del productor + analisis
    XLSX.utils.sheet_add_aoa(worksheet, [['INFORMACIÓN DEL PRODUCTOR']], {
      origin: `A${rowIndex}`,
    });
    var cellAddress = XLSX.utils.encode_cell({ r: rowIndex - 1, c: 0 });
    if (!worksheet[cellAddress]) {
      worksheet[cellAddress] = { v: ['INFORMACIÓN DEL PRODUCTOR'] };
    }
    worksheet[cellAddress].s = { ...this.infoStyle, ...this.centeredStyle };
    // Fusionar celdas A1 y B1
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({
      s: { r: rowIndex - 1, c: 0 },
      e: { r: rowIndex - 1, c: 1 },
    });

    rowIndex++;

    Object.entries(encabezado).forEach(([key, value]) => {
      XLSX.utils.sheet_add_aoa(worksheet, [[key, value]], {
        origin: `A${rowIndex}`,
      });

      var cellAddress = XLSX.utils.encode_cell({ r: rowIndex - 1, c: 0 });
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { v: key };
      }
      worksheet[cellAddress].s = this.boldStyle;

      var cellAddress = XLSX.utils.encode_cell({ r: rowIndex - 1, c: 1 });
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { v: value };
      }
      worksheet[cellAddress].s = this.borderStyle;
      rowIndex++;
    });
    rowIndex++;

    ///////////////////////// EMPIEZA TABLA RESUMEN //////////////////////////////
    //Titulo resumen contable
    XLSX.utils.sheet_add_aoa(worksheet, [['RESUMEN CONTABLE']], {
      origin: `E${rowResumenContable}`,
    });

    var cellAddress = XLSX.utils.encode_cell({
      r: rowResumenContable - 1,
      c: 4,
    });
    if (!worksheet[cellAddress]) {
      worksheet[cellAddress] = { v: ['RESUMEN CONTABLE'] };
    }
    worksheet[cellAddress].s = { ...this.resumenStyle, ...this.centeredStyle };
    // Fusionar celdas A1 y B1
    worksheet['!merges'] = worksheet['!merges'] || [];
    worksheet['!merges'].push({
      s: { r: rowResumenContable - 1, c: 4 },
      e: { r: rowResumenContable - 1, c: 5 },
    });
    rowResumenContable++;

    //Datos de tabla resumen contable

    Object.entries(resumenContable).forEach(([key, value]) => {
      XLSX.utils.sheet_add_aoa(worksheet, [[key, value]], {
        origin: `E${rowResumenContable}`,
      });

      var cellAddress = XLSX.utils.encode_cell({
        r: rowResumenContable - 1,
        c: 4,
      });
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { v: key };
      }
      worksheet[cellAddress].s = this.boldStyle;

      var cellAddress = XLSX.utils.encode_cell({
        r: rowResumenContable - 1,
        c: 5,
      });
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { v: value };
      }
      worksheet[cellAddress].s = this.borderStyle;
      rowResumenContable++;
    });
    rowIndex++;

    ///////////////////////// TERMINA TABLA RESUMEN //////////////////////////////

    ////////////////////////// HEADERS DE DATOS //////////////////////////
    const headers = [
      ['Epoca', 'Cantidad', 'Unidad', 'Costo', 'Costo/ha', 'Costo total'],
    ];

    ////////////////////////// AGREGAR LA FILA ITEM + HEADERS //////////////////////////

    data.forEach((element: any, index: any) => {
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [[...[`${element[0].item} (${LETRAS[index]})`], ...headers[0]]],
        {
          origin: `A${rowIndex}`,
        }
      );

      //Aplicar el estilo a los encabezados
      [...[element[0].item], ...headers[0]].forEach((header, colIndex) => {
        var cellAddress = XLSX.utils.encode_cell({
          r: rowIndex - 1,
          c: colIndex,
        });
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { v: header };
        }
        worksheet[cellAddress].s = this.itemsStyle;
      });
      rowIndex++;

      // Iterar sobre cada conjunto de datos (omitimos el primer elemento que es el item)
      const totalItem = element.slice(-1)[0];

      element.slice(1, -1).forEach((set: any[]) => {
        // Añadir la fila labores (subitems)

        XLSX.utils.sheet_add_aoa(worksheet, [[set[0].subitem]], {
          origin: `A${rowIndex}`,
        });

        // Agregando estilos a los subitems
        var cellAddress = XLSX.utils.encode_cell({ r: rowIndex - 1, c: 0 });
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { v: element[0].item };
        }
        worksheet[cellAddress].s = this.subitemsStyle;
        rowIndex++;

        var totalSubItem = set.slice(-1)[0];
        // Añadir los datos de "Nombre" y "Epoca", etc
        set.slice(1, -1).forEach((item, colIndex) => {
          XLSX.utils.sheet_add_aoa(worksheet, [Object.values(item)], {
            origin: `A${rowIndex}`,
          });

          Object.values(item).forEach((values, colIndex) => {
            var cellAddress = XLSX.utils.encode_cell({
              r: rowIndex - 1,
              c: colIndex,
            });
            if (!worksheet[cellAddress]) {
              worksheet[cellAddress] = { v: values };
            }
            worksheet[cellAddress].s = this.borderStyle;
          });
          rowIndex++;
        });

        //Agregando la suma de los sub-items
        var values = [['Subtotal: '], ...Object.values(totalSubItem)];
        XLSX.utils.sheet_add_aoa(worksheet, [values], {
          origin: `E${rowIndex}`,
        });
        //Agregando estilos
        values.forEach((value, colIndex) => {
          //console.log(value, colIndex);
          var cellAddress = XLSX.utils.encode_cell({
            r: rowIndex - 1,
            c: colIndex + 4,
          });
          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { v: value };
          }
          worksheet[cellAddress].s = this.totalStyle;
        });
        // Añadir una fila vacía entre conjuntos de datos
        rowIndex++;
      });
      //Agregando la suma de los items
      var values = [['Total: '], ...Object.values(totalItem)];
      XLSX.utils.sheet_add_aoa(worksheet, [values], {
        origin: `E${rowIndex}`,
      });
      values.forEach((value, colIndex) => {
        //console.log(rowIndex, colIndex);
        var cellAddress = XLSX.utils.encode_cell({
          r: rowIndex - 1,
          c: colIndex + 4,
        });
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { v: value };
        }
        worksheet[cellAddress].s = this.totalStyle;
      });
      rowIndex++;
      rowIndex++;
    });

    // Calcular el ancho óptimo para cada columna
    const colWidths = [];
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxWidth = 10; // Ancho mínimo para una columna
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          const cellValue = cell.v.toString();
          const cellWidth = cellValue.length;
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
          }
        }
      }
      colWidths.push({ width: maxWidth });
    }
    worksheet['!cols'] = colWidths;

    // Establecer la altura de la primera fila (indexada desde 0, por lo que fila 1 es el índice 0)
    worksheet['!rows'] = [
      { hpt: 40 }, // Altura de la primera fila en puntos
    ];

    // Crear un libro de trabajo y agregar la hoja de trabajo
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Escribir el archivo Excel
    XLSX.writeFile(
      workbook,
      `FICHA-DE-COSTO_${titulo.type_crop}_${titulo.season}_${encabezado['Nombre del productor']}.xlsx`
    );
  }
}
