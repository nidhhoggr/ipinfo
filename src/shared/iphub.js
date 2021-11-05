const fetch = require('node-fetch');
module.exports = (app) => {

  function debug() {
    return app.modules.debug('modules:iphub')(arguments[0])
  }

  function parse(response) {
    return {
      country: response.countryName,
      provider: response.isp,
      score: (response.block == 2) ? .5 : response.block
    };
  }

  function info(args, cb) {
    const { ip } = args;
    const url = `http://v2.api.iphub.info/ip/${ip}`;
    debug(`Fetching ${url}`);
    fetch(url, { method: 'GET', headers: {"X-Key": "MTU3Nzc6alF6c1ZxeTNUZU5WVng5ZnVEYUk0QlkycU1LNFcyN3o="}})
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
