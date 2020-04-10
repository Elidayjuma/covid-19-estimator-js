const jsonxml = require('jsontoxml');

const covid19ImpactEstimator = async (req, res) => {
  try {
    const input = req.body;
    const currentlyInfected = req.body.reportedCases * 10;
    const serverCurrentlyInfcted = req.body.reportedCases * 50;
    // Calculate the time to elapse
    let estimateTime;
    if (req.body.periodType === 'days') {
      estimateTime = req.body.timeToElapse;
    } else if (req.body.periodType === 'weeks') {
      estimateTime = req.body.timeToElapse * 7;
    } else if (req.body.periodType === 'months') {
      estimateTime = req.body.timeToElapse * 30;
    }
    const setOfDays = Math.floor(estimateTime / 3);
    const infectionsByRequestedTime = currentlyInfected * (2 ** setOfDays);
    const serverinfectionsByRequestedTime = serverCurrentlyInfcted * (2 ** setOfDays);
    const severeCasesByRequestedTime = ((15 / 100) * infectionsByRequestedTime);
    const ServeresevereCasesByRequestedTime = ((15 / 100) * serverinfectionsByRequestedTime);
    // calculate the number of beds
    const bedsAreadyOccupied = (0.65 * input.totalHospitalBeds);
    const availableBeds = (input.totalHospitalBeds - bedsAreadyOccupied);
    const hospitalBedsByRequestedTime = Math.trunc(availableBeds - severeCasesByRequestedTime);
    const serverehospitalBedsByRequestedTime = Math.trunc(
      availableBeds - ServeresevereCasesByRequestedTime
    );
    // cases that require ICU care
    const casesForICUByRequestedTime = Math.trunc((0.05 * infectionsByRequestedTime));
    const servercasesForICUByRequestedTime = Math.trunc((0.05 * serverinfectionsByRequestedTime));
    // cases that will require ventilators
    const casesForVentilatorsByRequestedTime = Math.trunc((0.02 * infectionsByRequestedTime));
    const servercasesForVentilatorsByRequestedTime = Math.trunc(
      (0.02 * serverinfectionsByRequestedTime)
    );
    // amount of money to be lost in the economy
    const totalIncomePerperson = input.region.avgDailyIncomeInUSD / estimateTime;
    const dailyAvgIncome = input.region.avgDailyIncomePopulation;
    const dollarsInFlight = Math.trunc((
      (infectionsByRequestedTime * dailyAvgIncome) * totalIncomePerperson));
    const svrDlrsInFlight = Math.trunc((
      (serverinfectionsByRequestedTime * dailyAvgIncome) * totalIncomePerperson));
    // return reponse req.body
    return {
      data: input,
      impact: {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
      },
      severeImpact: {
        currentlyInfected: serverCurrentlyInfcted,
        infectionsByRequestedTime: serverinfectionsByRequestedTime,
        severeCasesByRequestedTime: ServeresevereCasesByRequestedTime,
        hospitalBedsByRequestedTime: serverehospitalBedsByRequestedTime,
        casesForICUByRequestedTime: servercasesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime: servercasesForVentilatorsByRequestedTime,
        dollarsInFlight: svrDlrsInFlight
      }
    };
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      message: 'Internal server error!'
    });
  }
};


exports.jsonResponder = async (req, res) => {
  try {
    const response = await covid19ImpactEstimator(req, res);
    const { data, impact, severeImpact } = response;
    return res.status(200).json({
      data,
      impact,
      severeImpact
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error!'
    });
  }
};

// eslint-disable-next-line consistent-return
exports.xmlResponder = async (req, res) => {
  try {
    const response = await covid19ImpactEstimator(req, res);
    const { data, impact, severeImpact } = response;
    const xml = jsonxml({
      data,
      impact,
      severeImpact
    });
    res.set('Content-Type', 'text/xml');
    res.send(xml);
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error!'
    });
  }
};
