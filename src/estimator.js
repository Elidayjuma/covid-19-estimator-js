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
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  const serverehospitalBedsByRequestedTime = availableBeds - ServeresevereCasesByRequestedTime;

  // return reponse data
  return {
    data: input,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime
    },
    severeImpact: {
      currentlyInfected: serverCurrentlyInfcted,
      infectionsByRequestedTime: serverinfectionsByRequestedTime,
      severeCasesByRequestedTime: ServeresevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: serverehospitalBedsByRequestedTime
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
