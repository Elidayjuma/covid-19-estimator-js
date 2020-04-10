const express = require('express');

const router = express.Router();

const covidController = require('./cotroller');

router.post('/', covidController.jsonResponder);
router.post('/json', covidController.jsonResponder);
router.post('/xml', covidController.xmlResponder);


module.exports = router;
