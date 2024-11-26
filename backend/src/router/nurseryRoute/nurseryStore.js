const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const {
    //* Import Tabs Controller 
    addNurseryStoreTabs,
    getNurseryStoreTabById,
    getAllNurseryStoreTabs,
    editNurseryStoreTab,
    deleteNurseryStoreTab,

    //* Import Template Controller
    addNurseryStoreTemplates,
    getNurseryStoreTemplateById,
    getAllNurseryStoreTemplate,
    editNurseryStoreTemplate,
    deleteNurseryStoreTemplate,
    getAllNurseryStoreTemplateByTabId,

    //* Import Block Controller
    addNurseryStoreBlock,
    getNurseryStoreBlockById,
    getAllNurseryStoreBlock,
    getAllNurseryStoreBlockByTabId,
    editNurseryStoreBlock,
    deleteNurseryStoreBlock,

    //* Import Image Controller
    uploadNurseryStoreImage,

} = require('../../controllers/nurseryController/nurseryStoreController');

router.use(auth);

//* Route for nursery store tabs 
router.route('/store/tab')
    .post(addNurseryStoreTabs)
    .get(getAllNurseryStoreTabs);

router.route('/store/tab/:id')
    .get(getNurseryStoreTabById)
    .patch(editNurseryStoreTab)
    .delete(deleteNurseryStoreTab);


//* Route for nursery store Template Controller 
router.route('/store/template')
    .post(addNurseryStoreTemplates)
    .get(getAllNurseryStoreTemplate);

router.route('/store/byTabId/templates/:id')
    .get(getAllNurseryStoreTemplateByTabId)
    .patch(editNurseryStoreTemplate);

router.route('/store/template/:id')
    .get(getNurseryStoreTemplateById)
    .patch(editNurseryStoreTemplate)
    .delete(deleteNurseryStoreTemplate);


//* Route for nursery store Block
router.route('/store/block')
    .post(addNurseryStoreBlock)
    .get(getAllNurseryStoreBlock);

router.route('/store/byTabId/block/:id')
    .get(getAllNurseryStoreBlockByTabId);

router.route('/store/block/:id')
    .get(getNurseryStoreBlockById)
    .patch(editNurseryStoreBlock)
    .delete(deleteNurseryStoreBlock);


router.route('/store/images/:id')
    .post(uploadNurseryStoreImage);

module.exports = router;