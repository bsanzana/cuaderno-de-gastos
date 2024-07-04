const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let formSchema = new Schema(
  {
    //Los primeros campos del formulario que son requeridos
    informacion_del_campo: {
      season: {
        type: Schema.Types.ObjectId,
        ref: "Season",
      },
      active: {
        type: Boolean,
      },
      company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
      },
      company_field: {
        type: String,
      },
      total_ha: {
        type: Number,
      },
      cultivated_area: {
        type: Number,
      },
      possession: {
        type: String,
      },
      possession_rent: {
        type: Schema.Types.Mixed,
      },
      soil_analysis: {
        type: Boolean,
      },
      // Item Agua
      water: {
        water_source: {
          type: String,
        },
        possession: {
          type: String,
        },
        power_source: {
          type: String,
        },
        irrigation_system: {
          type: String,
        },
        obs: {
          type: String,
        },
      },
      // Item Cultivo
      crop: {
        agricultural_insurance: {
          type: Boolean,
        },
        variety: {
          type: Schema.Types.ObjectId,
          ref: "Seed",
        },
        seed_type: {
          type: Schema.Types.ObjectId,
          ref: "SeedType",
        },
        type_crop: {
          type: Schema.Types.ObjectId,
          ref: "Crop",
        },
        fecha_cosecha: {
          type: Date,
        },
        fecha_siembra: {
          type: Date,
        },
      },
    },
    //Información que se ingresa más de una vez
    //Item Maquinarias
    maquinarias: [
      {
        amount: {
          type: Number,
        },
        epoca: [],
        labor: {
          type: Schema.Types.ObjectId,
          ref: "Work",
        },
        machinery: {
          type: Schema.Types.ObjectId,
          ref: "Machinery",
        },
        price: {
          type: Number,
        },
        total_cost: {
          type: Number,
        },
        total_cost_ha: {
          type: Number,
        },
        unit: {
          type: String,
        },
      },
    ],
    //Item insumos
    insumos: [
      {
        amount: {
          type: Number,
        },
        epoca: [],
        category: {
          type: Schema.Types.ObjectId,
          ref: "CategoryProducts",
        },
        product: {
          type: String,
        },
        price: {
          type: Number,
        },
        total_cost: {
          type: Number,
        },
        total_cost_ha: {
          type: Number,
        },
        unit: {
          type: String,
        },
      },
    ],
    mano_de_obra: [
      {
        amount: {
          type: Number,
        },
        epoca: [],
        labor: {
          type: Schema.Types.ObjectId,
          ref: "Work",
        },
        mo: {
          type: Schema.Types.ObjectId,
          ref: "PlantingMethod",
        },
        price: {
          type: Number,
        },
        total_cost: {
          type: Number,
        },
        total_cost_ha: {
          type: Number,
        },
        unit: {
          type: String,
        },
      },
    ],
    otros_costos: [
      {
        amount: {
          type: Number,
        },
        epoca: [],
        labor: {
          type: Schema.Types.ObjectId,
          ref: "Work",
        },
        otro_costo: {
          type: Schema.Types.ObjectId,
          ref: "ApplicationMethod",
        },
        price: {
          type: Number,
        },
        total_cost: {
          type: Number,
        },
        total_cost_ha: {
          type: Number,
        },
        unit: {
          type: String,
        },
      },
    ],
    guia_analisis: {
      industria: {
        type: String,
      },
      limpioSeco: {
        type: Number,
      },
      limpioSecoHA: {
        type: Number,
      },
      pesoBrutoHA: {
        type: Number,
      },
      pesoBruto: {
        type: Number,
      },

      precioVenta: {
        type: Number,
      },
    },
    pathGuiaAnalisis: {
      type: String,
      default: ''
    },
    pathAnalisisSuelo: {
      type: String,
      default: ''
    },
    pathAdopcion1: {
      type: String,
      default: ''
    },
    pathAdopcion2: {
      type: String,
      default: ''
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("Form", formSchema);
