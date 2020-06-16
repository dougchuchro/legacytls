const axios = require('axios');
const config = require('./config');

class Services {

    constructor() {
        var { fastlyApiToken, fastyAccountId } = config;
        this.customerId = fastyAccountId;
        this.instance = axios.create({
            url: `/services?filter\[customer_id\]=${fastyAccountId}&page\[size\]=100&filter\[deleted\]=false`,
            method: 'get',       
            baseURL: 'https://api.fastly.com/',
            timeout: 3000,  // 3 second timout
            headers: {
                'fastly-key': fastlyApiToken,
                'Host': 'api.fastly.com',
              }
            });
        this.serviceList = [];
   }

   async fetchServices () {
       try {
           const response = await this.instance.get();
            this.serviceList = response.data.data;
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Services;
