const express = require('express');

const router = express.Router();

const covidController = require('./cotroller');

router.post('/', covidController.covid19ImpactEstimator);
// router.post('/json', covidController.logout);
// router.post('/xml', covidController.signupValidation);

module.exports = router;
