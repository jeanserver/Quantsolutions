const express = require('express');
const { selectPlan, getMySelections } = require('../controllers/userInvestmentController');
const { selectPlanValidator } = require('../validators/userInvestmentValidator');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/mine', getMySelections);
router.post('/', selectPlanValidator, validateRequest, selectPlan);

module.exports = router;
