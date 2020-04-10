const covid19ImpactEstimator = (data) => {
  const input = data;
  const currentlyInfected = data.reportedCases * 10;
  const serverCurrentlyInfcted = data.reportedCases * 50;
  // Calculate the time to elapse
  let estimateTime;
  if (data.periodType === 'days') {
    estimateTime = data.timeToElapse;
  } else if (data.periodType === 'weeks') {
    estimateTime = data.timeToElapse * 7;
  } else if (data.periodType === 'months') {
    estimateTime = data.timeToElapse * 30;
  }
  const setOfDays = Math.floor(estimateTime / 3);
  const infectionsByRequestedTime = currentlyInfected * (2 ** setOfDays);
  const serverinfectionsByRequestedTime = serverCurrentlyInfcted * (2 ** setOfDays);
  const severeCasesByRequestedTime = ((15 / 100) * infectionsByRequestedTime);
  const ServeresevereCasesByRequestedTime = ((15 / 100) * serverinfectionsByRequestedTime);
  // calculate the number of beds
  const bedsAreadyOccupied = (0.65 * data.totalHospitalBeds);
  const availableBeds = (data.totalHospitalBeds - bedsAreadyOccupied);
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
  const totalIncomePerperson = data.region.avgDailyIncomeInUSD * estimateTime;
  const dailyAvgIncome = data.region.avgDailyIncomePopulation;
  const dollarsInFlight = Math.round((
    (infectionsByRequestedTime * dailyAvgIncome) * totalIncomePerperson) * 100) / 100;
  const svrDlrsInFlight = Math.round((
    (serverinfectionsByRequestedTime * dailyAvgIncome) * totalIncomePerperson) * 100) / 100;
  // return reponse data
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

export default covid19ImpactEstimator;
