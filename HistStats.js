const axios = require('axios');
const config = require('./config');

class HistStats {

    constructor(service) {
        var { fastlyApiToken, startDate, endDate } = config;
        startDate   = Date.parse(startDate)/1000;
        endDate     = Date.parse(endDate)/1000;
        this.serviceId = service.id;
        this.serviceName = service.attributes.name;
        this.instance = axios.create({
            url: `/stats/service/${this.serviceId}?region=all&from=${startDate}&to=${endDate}&by=day`,
            method: 'get',       
            baseURL: 'https://api.fastly.com/',
            timeout: 5000,
            headers: {
                'fastly-key': fastlyApiToken,
                'Host': 'api.fastly.com',
              }
            });

        this.hs = [];
        this.totalRequests = 0;
        this.totalTls = 0;
        this.totalTls_v10 = 0;
        this.totalTls_v11 = 0;
        this.totalTls_v12 = 0;
        this.totalTls_v13 = 0;
   }

   async fetchHistStats () {
       try {
           const response = await this.instance.get();
            this.hs = response.data.data;
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    summarizeHistStats() {
        
        this.hs.forEach(function (stat) {
            this.totalRequests  += stat.requests;
            this.totalTls       += stat.tls;
            this.totalTls_v10   += stat.tls_v10;
            this.totalTls_v11   += stat.tls_v11;
            this.totalTls_v12   += stat.tls_v12;
            this.totalTls_v13   += stat.tls_v13;
        }, this);
    }

    showSummary() {
        console.log(`SUMMARY FOR SERVICE ${this.serviceName} (${this.serviceId})`);
        if (this.totalTls == 0) {
            console.log(`No TLS requests for this service`);
            console.log("");
            return;
        }
        console.log(`totalRequests: ${this.totalRequests.toLocaleString()}`);
        console.log(`totalTls: ${this.totalTls.toLocaleString()},  ${((this.totalTls/this.totalRequests)*100).toLocaleString()}% of totalRequests`);
        console.log(`totalTls_v10: ${this.totalTls_v10.toLocaleString()}, ${((this.totalTls_v10/this.totalTls)*100).toLocaleString()}% of totalTls`);
        console.log(`totalTls_v11: ${this.totalTls_v11.toLocaleString()}, ${((this.totalTls_v11/this.totalTls)*100).toLocaleString()}% of totalTls`);
        console.log(`total Legacy TLS: ${(this.totalTls_v11+this.totalTls_v10).toLocaleString()}, ${(((this.totalTls_v11+this.totalTls_v10)/this.totalTls)*100).toLocaleString()}% of totalTls`);
        console.log(`totalTls_v12: ${this.totalTls_v12.toLocaleString()}, ${((this.totalTls_v12/this.totalTls)*100).toLocaleString()}% of totalTls`);
        console.log(`totalTls_v13: ${this.totalTls_v13.toLocaleString()}, ${((this.totalTls_v13/this.totalTls)*100).toLocaleString()}% of totalTls`);
        console.log("");
    }
}

module.exports = HistStats;
