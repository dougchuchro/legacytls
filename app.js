const Services = require('./Services');
const HistStats = require('./HistStats');

const services = new Services();
const config = require('./config');
const { fastlyApiToken, fastyAccountId, startDate, endDate } = config;

(async function() {
  // Fetch all of the un-delete services in the given account
  let response = await services.fetchServices();

  console.log(`Analyzing ${services.serviceList.length} services in Fastly Account ID ${fastyAccountId} from ${startDate} to ${endDate}  ...`);
  console.log("");

  // Array to hold the Hisotrical Stats objects for all services in the given account
  var svcHS = [];

  // Create a HistStats object for each service and push it to the array
  services.serviceList.forEach( async (service) => {
    svcHS.push(new HistStats(service));
  });

  // Fetch the Historical Stats for all services
  let result = await Promise.all(svcHS.map( hs => hs.fetchHistStats()));
  
  // Summarize the HS data
  svcHS.forEach( (hs) => {hs.summarizeHistStats()});
  // Sort by highest volumne of TLS requests
  svcHS.sort((a, b) => b.totalTls - a.totalTls);
  // Send summary to console  
  svcHS.forEach( (hs) => {hs.showSummary()});

})();
