const express = require('express');
const { getMe, validateRule } = require('../controllers/ruleValidate');

const router = express.Router();

router.get('/', getMe);

router.post('/validate-rule', validateRule);

module.exports = router;
