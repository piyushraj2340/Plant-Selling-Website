const express = require('express');
const {
    getAllTabsNurseryStorePublicView,
    getNurseryDetail, 
    getAllTemplatesNurseryStorePublicView,
    getAllBlocksNurseryStorePublicView, 
    nurseryStoreContactUs, 
    getNurseryStoreMessage, 
    NurseryStoreMessageMarkAsViewed 
} = require('../../controllers/nurseryController/nurseryStorePublicController');

    
const router = express.Router();

router.route("/store/view/:id/getAllTabs")
    .get(getAllTabsNurseryStorePublicView);

router.route("/store/view/:nurseryId/getAllTemplates/:tabId")
    .get(getAllTemplatesNurseryStorePublicView);

router.route("/store/view/:nurseryId/getAllBlocks/:tabId")
    .get(getAllBlocksNurseryStorePublicView);

router.route("/store/view/:id/contactUs")
    .post(nurseryStoreContactUs);

router.route("/store/view/:id/contactUs")
    .get(getNurseryStoreMessage);


router.route("/store/view/:nurseryId/contactUs/:messageId")
    .get(NurseryStoreMessageMarkAsViewed);

router.route("/details/:id")
    .get(getNurseryDetail);


module.exports = router;