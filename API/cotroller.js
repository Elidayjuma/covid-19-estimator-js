exports.covid19ImpactEstimator = async (req, res) => {
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
    const bedsAreadyOccupied = (0.65 * req.body.totalHospitalBeds);
    const availableBeds = (req.body.totalHospitalBeds - bedsAreadyOccupied);
    const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
    const serverehospitalBedsByRequestedTime = availableBeds - ServeresevereCasesByRequestedTime;
    // cases that require ICU care
    const casesForICUByRequestedTime = (0.05 * infectionsByRequestedTime);
    const servercasesForICUByRequestedTime = (0.05 * serverinfectionsByRequestedTime);
    // cases that will require ventilators
    const casesForVentilatorsByRequestedTime = (0.02 * infectionsByRequestedTime);
    const servercasesForVentilatorsByRequestedTime = (0.02 * serverinfectionsByRequestedTime);
    // amount of money to be lost in the economy
    const totalIncomePerperson = req.body.region.avgDailyIncomeInUSD * estimateTime;
    const dailyAvgIncome = req.body.region.avgDailyIncomePopulation;
    const dollarsInFlight = (infectionsByRequestedTime * dailyAvgIncome) * totalIncomePerperson;
    const svrDollarloss = (serverinfectionsByRequestedTime * dailyAvgIncome) * totalIncomePerperson;
    // return reponse req.body
    return res.status(200).json({
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
        dollarsInFlight: svrDollarloss
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error!'
    });
  }
};


// const data = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.71
//   },
//   periodType: 'days',
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
// };
// covid19ImpactEstimator(data);

// export default covid19ImpactEstimator;
