const express = require('express');
const { listInvestments } = require('../controllers/investmentController');
const { listInvestmentsValidator } = require('../validators/investmentValidator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', listInvestmentsValidator, validateRequest, listInvestments);

module.exports = router;
