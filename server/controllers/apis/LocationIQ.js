const axios = require("axios");
const { locationIQ } = require("../../config/config");

const reverseGeocodeLocationIQ = axios.create({
  baseURL: `https://us1.locationiq.com/v1/reverse.php?key=${locationIQ.privateToken}`,
});

module.exports = { reverseGeocodeLocationIQ };
