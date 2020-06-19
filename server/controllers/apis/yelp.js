const { yelp:yelpConfig } = require('../../config/config');
      axios = require('axios');

const yelp = axios.create({
				baseURL: 'https://api.yelp.com/v3',
				headers: {
					'Authorization' : `Bearer ${yelpConfig.apiKey}`,
					'Content-type': 'application/json'
				}
			 });

module.exports = { yelp };