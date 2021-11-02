const fetch = require('node-fetch');
module.exports = (app) => {

  function debug() {
    return app.modules.debug('modules:ipgeolocation')(arguments[0])
  }

  function parse(response) {
    return {
      country: response.country_name,
      state: response.state_prov,
      city: response.city,
      district: response.district,
      lat: response.latitude,
      lon: response.longitude,
      provider: response.isp,
    };
  }

  function info(args, cb) {
    const { ip } = args;
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${app.config.ipgeolocation.api_key}&ip=${ip}`;
    debug(`Fetching ${url}`);
    fetch(url)
      .then(fRes => fRes.json())
      .then(json => {
        debug(json);
        return cb(undefined, parse(json));
      })
      .catch(cb) 
  }

  const infoAsync = require('util').promisify(info);

  return {
    info,
    infoAsync,
  };
}
