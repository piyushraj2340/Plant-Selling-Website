const router = require('express').Router();

const auth = require('../middleware/auth');

const { addAddress, getAddressList, getAddressById, updateAddress, deleteAddress, getDefaultAddress } = require('../controllers/addressController');

router.use(auth); //* Auth middleware

//* Route /address
router.route('/address')
    .post(addAddress)
    .get(getAddressList);

//* Route /address/:id
router.route('/address/:id')
    .get(getAddressById)
    .patch(updateAddress)
    .delete(deleteAddress);

//* Route /default/address
router.get('/default/address', getDefaultAddress);

module.exports = router;
