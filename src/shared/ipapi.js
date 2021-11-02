const fetch = require('node-fetch');
module.exports = (app) => {

  function debug() {
    return app.modules.debug('modules:ipapi')(arguments[0])
  }

  function parse(response) {
    return {
      country: response.country,
      state: response.regionName,
      city: response.city,
      lat: response.lat,
      lon: response.lon,
      provider: response.isp,
      org: response.org,
    };
  }

  function info(args, cb) {
    const { ip } = args;
    const url = `http://ip-api.com/json/${ip}`;
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
