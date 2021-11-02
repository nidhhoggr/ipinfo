const fetch = require('node-fetch');
module.exports = (app) => {

  function debug() {
    return app.modules.debug('modules:ipstack')(arguments[0])
  }

  function parse(response) {
    return {
      country: response.country_name,
      state: response.region_name,
      city: response.city,
      lat: response.latitude,
      lon: response.longitude,
      provider: response?.connection?.isp,
    };
  }

  function info(args, cb) {
    const { ip } = args;
    const url = `http://api.ipstack.com/${ip}?access_key=${app.config.ipstack.api_key}`;
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
