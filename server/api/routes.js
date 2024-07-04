const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const authentication = require('./controllers/authentication.js');
const uploads = require('./config/uploads');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'user',
    // algorithms: ["HS256"],
    // credentialsRequired: false,
});


const path = require('path');
const checkUser = authentication.checkUser;

/** REQUIRES */
const applicationMethod = require('./controllers/applicationMethod');
const chemicalProduct = require('./controllers/chemicalProduct');
const company = require('./controllers/company.js');
const companyGroup = require('./controllers/companyGroup.js');
const fertilizer = require('./controllers/fertilizer.js');
const form = require('./controllers/form.js');
const machinery = require('./controllers/machinery');
const plantingMethod = require('./controllers/mano-de-obra');
const region = require('./controllers/region.js');
const season = require('./controllers/season.js');
const crop = require('./controllers/crop.js');
const seed = require('./controllers/seed.js');
const seedType = require('./controllers/seedType.js');
const user = require('./controllers/user.js');
const work = require('./controllers/work.js');
const specialists = require('./controllers/specialist.js');


const categoryProducts = require('./controllers/category.js')
const product = require('./controllers/product.js')

/** APIS */
// AUTHENTICATION API
router.post('/loginProducer', authentication.loginProducer);
router.post('/login', authentication.login);
router.post('/logout', auth, authentication.logLogOut);

// APPLICATION METHOD API
router.get('/application-methods', auth, checkUser(['adviser', 'admin']), applicationMethod.getAllApplicationMethods);
router.get('/application-methods/list', auth, checkUser(['adviser', 'admin']), applicationMethod.applicationMethodList);
router.get('/application-methods/:pid', auth, checkUser(['adviser', 'admin']), applicationMethod.getApplicationMethod);
router.post('/application-methods', auth, checkUser(['adviser', 'admin']), applicationMethod.createApplicationMethod);
router.patch('/application-methods/:pid', auth, checkUser(['adviser', 'admin']), applicationMethod.editApplicationMethod);
router.delete('/application-methods/:pid', auth, checkUser(['adviser', 'admin']), applicationMethod.deleteApplicationMethod);

// CHEMICAL PRODUCT API
router.get('/chemical-products', auth, checkUser(['adviser', 'admin']), chemicalProduct.getAllChemicalProducts);
router.get('/chemical-products/list', auth, checkUser(['adviser', 'admin']), chemicalProduct.chemicalProductList);
router.get('/chemical-products/:pid', auth, checkUser(['adviser', 'admin']), chemicalProduct.getChemicalProduct);
router.post('/chemical-products', auth, checkUser(['adviser', 'admin']), chemicalProduct.createChemicalProduct);
router.patch('/chemical-products/:pid', auth, checkUser(['adviser', 'admin']), chemicalProduct.editChemicalProduct);
router.delete('/chemical-products/:pid', auth, checkUser(['adviser', 'admin']), chemicalProduct.deleteChemicalProduct);

// COMPANY API
router.get('/companies', auth, checkUser(['adviser', 'admin']), company.getAllCompanies);
router.get('/companies/list', auth, checkUser(['adviser', 'admin']), company.companyList);
router.get('/companies/:cid', auth, checkUser(['adviser', 'admin']), company.getCompany);
router.post('/companies', auth, checkUser(['adviser', 'admin']), company.createCompany);
router.patch('/companies/:cid', auth, checkUser(['adviser', 'admin']), company.editCompany);
router.delete('/companies/:cid', auth, checkUser(['adviser', 'admin']), company.deleteCompany);

// COMPANY GROUP API
router.get('/company-groups', auth, checkUser(['adviser', 'admin']), companyGroup.getAllCompanyGroups);
router.get('/company-groups/list', auth, checkUser(['adviser', 'admin']), companyGroup.companyGroupList);
router.get('/company-groups/:pid', auth, checkUser(['adviser', 'admin']), companyGroup.getCompanyGroup);
router.post('/company-groups', auth, checkUser(['adviser', 'admin']), companyGroup.createCompanyGroup);
router.patch('/company-groups/:pid', auth, checkUser(['adviser', 'admin']), companyGroup.editCompanyGroup);
router.delete('/company-groups/:pid', auth, checkUser(['adviser', 'admin']), companyGroup.deleteCompanyGroup);

// FERTILIZER API
router.get('/fertilizers', auth, checkUser(['adviser', 'admin']), fertilizer.getAllFertilizers);
router.get('/fertilizers/list', auth, checkUser(['adviser', 'admin']), fertilizer.fertilizerList);
router.get('/fertilizers/:pid', auth, checkUser(['adviser', 'admin']), fertilizer.getFertilizer);
router.post('/fertilizers', auth, checkUser(['adviser', 'admin']), fertilizer.createFertilizer);
router.patch('/fertilizers/:pid', auth, checkUser(['adviser', 'admin']), fertilizer.editFertilizer);
router.delete('/fertilizers/:pid', auth, checkUser(['adviser', 'admin']), fertilizer.deleteFertilizer);

// FORM API

//Con esto guardamos los archivos
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


router.get('/forms', auth, checkUser(['adviser', 'admin', 'producer']), form.getAllForms);
router.get('/forms/exports', auth, checkUser(['adviser', 'admin']), form.getExportForms);
router.get('/forms/list', auth, checkUser(['adviser', 'admin']), form.getFormList);
router.get('/forms/exist/:cid/:sid/:fid', auth, checkUser(['adviser', 'admin']), form.existForm);
router.get('/forms/view/:pid', auth, checkUser(['adviser', 'admin']), form.viewForm);
router.get('/forms/company/:cid', auth, checkUser(['adviser', 'admin']), form.getCompanyForms);
router.get('/forms/:pid', auth, checkUser(['adviser', 'admin']), form.getForm);
router.post('/forms',  auth, checkUser(['adviser', 'admin']), upload.any(), form.createForm);
router.post('/editForm', auth, checkUser(['adviser', 'admin']),  upload.any(),form.editForm);
router.delete('/forms/:pid', auth, checkUser(['adviser', 'admin']), form.deleteForm);

router.get('/downloadFiles', form.downloadFiles);

// MACHINERY API
router.get('/machines', auth, checkUser(['adviser', 'admin', 'producer']), machinery.getAllMachines);
router.get('/machines/list', auth, checkUser(['adviser', 'admin', 'producer']), machinery.machineList);
router.get('/machines/:pid', auth, checkUser(['adviser', 'admin', 'producer']), machinery.getMachinery);
router.post('/machines', auth, checkUser(['adviser', 'admin']), machinery.createMachinery);
router.patch('/machines/:pid', auth, checkUser(['adviser', 'admin']), machinery.editMachinery);
router.delete('/machines/:pid', auth, checkUser(['adviser', 'admin']), machinery.deleteMachinery);

// PLANTING METHOD API
router.get('/mano-de-obra', auth, checkUser(['adviser', 'admin', 'producer']), plantingMethod.getAllPlantingMethods);
router.get('/mano-de-obra/list', auth, checkUser(['adviser', 'admin', 'producer']), plantingMethod.plantingMethodList);
router.get('/mano-de-obra/:pid', auth, checkUser(['adviser', 'admin', 'producer']), plantingMethod.getPlantingMethod);
router.post('/mano-de-obra', auth, checkUser(['adviser', 'admin']), plantingMethod.createPlantingMethod);
router.patch('/mano-de-obra/:pid', auth, checkUser(['adviser', 'admin']), plantingMethod.editPlantingMethod);
router.delete('/mano-de-obra/:pid', auth, checkUser(['adviser', 'admin']), plantingMethod.deletePlantingMethod);

// REGION API
router.get('/regions', region.regionList);

// SEASON API
router.get('/seasons', auth, checkUser(['adviser', 'admin', 'producer']), season.getAllSeasons);
router.get('/seasons/list', auth, checkUser(['adviser', 'admin', 'producer']), season.seasonList);
router.get('/seasons/active', auth, checkUser(['adviser', 'admin', 'producer']), season.getActiveSeason);
router.get('/seasons/:sid', auth, checkUser(['adviser', 'admin', 'producer']), season.getSeason);
router.post('/seasons', auth, checkUser(['adviser', 'admin']), season.createSeason);
router.patch('/seasons/:sid', auth, checkUser(['adviser', 'admin']), season.editSeason);
router.patch('/seasons/:sid/active', auth, checkUser(['adviser', 'admin']), season.activeSeason);
router.delete('/seasons/:sid', auth, checkUser(['adviser', 'admin']), season.deleteSeason);

// CROP API
router.get('/crops', auth, checkUser(['adviser', 'admin', 'producer']), crop.getAllCrops);
router.get('/crops/list', auth, checkUser(['adviser', 'admin', 'producer']), crop.cropList);
// router.get('/seeds/:pid', auth, checkUser(['adviser', 'admin']), seed.getSeed);
router.post('/crops', auth, checkUser(['adviser', 'admin']), crop.createCrop);
router.patch('/crops/:cid', auth, checkUser(['adviser', 'admin']), crop.editCrop);
// router.delete('/seeds/:pid', auth, checkUser(['adviser', 'admin']), seed.deleteSeed);

// SEED API
router.get('/seeds', auth, checkUser(['adviser', 'admin', 'producer']), seed.getAllSeeds);
router.get('/seeds/list', auth, checkUser(['adviser', 'admin', 'producer']), seed.seedList);
router.get('/seeds/:pid', auth, checkUser(['adviser', 'admin', 'producer']), seed.getSeed);
router.post('/seeds', auth, checkUser(['adviser', 'admin']), seed.createSeed);
router.patch('/seeds/:pid', auth, checkUser(['adviser', 'admin']), seed.editSeed);
router.delete('/seeds/:pid', auth, checkUser(['adviser', 'admin']), seed.deleteSeed);

// SEED TYPE API
router.get('/seed-types', auth, checkUser(['adviser', 'admin', 'producer']), seedType.getAllSeedTypes);
router.get('/seed-types/list', auth, checkUser(['adviser', 'admin', 'producer']), seedType.seedTypeList);
router.get('/seed-types/:pid', auth, checkUser(['adviser', 'admin', 'producer']), seedType.getSeedType);
router.post('/seed-types', auth, checkUser(['adviser', 'admin']), seedType.createSeedType);
router.patch('/seed-types/:pid', auth, checkUser(['adviser', 'admin']), seedType.editSeedType);
router.delete('/seed-types/:pid', auth, checkUser(['adviser', 'admin']), seedType.deleteSeedType);

// USER API
router.get('/users', auth, checkUser(['adviser', 'admin', 'producer']), user.getAllUsers);
router.get('/users/:uid', auth, checkUser(['adviser', 'admin', 'producer']), user.getUser);
router.post('/users', auth, checkUser(['adviser', 'admin']), upload.any(), user.createUser);
router.patch('/users/:uid', auth, checkUser(['adviser', 'admin']), upload.any(), user.editUser);
router.delete('/users/:uid', auth, checkUser(['adviser', 'admin']), user.deleteUser);
router.patch('/users/:uid/password', auth, checkUser(['adviser', 'admin']), user.editUserPassword);

// WORK API
router.get('/works', auth, checkUser(['adviser', 'admin', 'producer']), work.getAllWorks);
router.get('/works/list', auth, checkUser(['adviser', 'admin', 'producer']), work.workList);
router.get('/works/:wid', auth, checkUser(['adviser', 'admin', 'producer']), work.getWork);
router.post('/works', auth, checkUser(['adviser', 'admin']), work.createWork);
router.patch('/works/:wid', auth, checkUser(['adviser', 'admin']), work.editWork);
router.delete('/works/:wid', auth, checkUser(['adviser', 'admin']), work.deleteWork);

// PRODUCTS - CATEGORY
router.get('/categorys', auth, checkUser(['adviser', 'admin', 'producer']), categoryProducts.getAllCategory);
router.post('/categorys', auth, checkUser(['adviser', 'admin']), categoryProducts.createCategory);
router.patch('/categorys/:cid', auth, checkUser(['adviser', 'admin']), categoryProducts.editCategory);

router.get('/products', auth, checkUser(['adviser', 'admin', 'producer']), product.getAllProduct);
router.post('/products', auth, checkUser(['adviser', 'admin']), product.createProduct);
router.patch('/products/:pid', auth, checkUser(['adviser', 'admin']), product.editProduct);

// SPECIALISTS API
router.get('/specialists', auth, checkUser(['adviser', 'admin', 'producer']), specialists.getAllSpecialists);
router.get('/specialists/:uid', auth, checkUser(['adviser', 'admin', 'producer']), specialists.getSpecialist);
router.post('/specialists', auth, checkUser(['adviser', 'admin']), uploads.avatar.single('image'), specialists.createSpecialist);
router.patch('/specialists/:uid', auth, checkUser(['adviser', 'admin']), uploads.avatar.single('image'), specialists.editSpecialist);


// Static files endpoints
router.use('/assets/avatar/:id', function(req, res) {
    res.sendFile(path.join(__dirname, '../uploads/avatar/', req.params.id));
});

router.use('/assets/logo/:id', function(req, res) {
    res.sendFile(path.join(__dirname, '../uploads/logo/', req.params.id));
});

router.use('/assets/firma/:id', function(req, res) {
    res.sendFile(path.join(__dirname, '../uploads/firma/', req.params.id));
});

module.exports = router;
