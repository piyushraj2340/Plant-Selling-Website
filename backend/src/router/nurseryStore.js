const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { addNurseryStoreSection, getAllNurseryStoreData, getNurseryStoreSectionById, updateNurseryStoreSection, deleteNurseryStoreSection, uploadNurseryStoreImage } = require('../controllers/nurseryStoreController');

router.use(auth);

router.route('/store')
    .post(addNurseryStoreSection)
    .get(getAllNurseryStoreData);

router.route('/store/:id')
    .get(getNurseryStoreSectionById)
    .patch(updateNurseryStoreSection)
    .delete(deleteNurseryStoreSection);


router.route('/store/images/:id')
    .post(uploadNurseryStoreImage);

module.exports = router;