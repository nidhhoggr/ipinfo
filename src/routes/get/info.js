const assert = require("assert");

module.exports = (app) => {

  debug = app.modules.debug('routes:info');

  function is_valid_response(response) {
    return !!response.city;
  }

  function cachingInfoLookup({ip} = {}) {
    return app.modules.cache.getAsync({
      key: `info:${ip}`,
      setterFn: async (cb) => {
        let cbReached = false; 
        let i, module;
        for (i in app.config.modules) {
          module = app.config.modules[i];
          const result = await app.modules[module].infoAsync({ip});
          debug(result);
          if (is_valid_response(result)) {
            cbReached = true;    
            cb(undefined, result);
            break;
          }
        }
        if (!cbReached) cb();
      }
    });
  }

  function cachingSpamLookup({ip} = {}) {
    return app.modules.cache.getAsync({
      key: `spam:${ip}`,
      setterFn: (cb) => app.modules["iphub"].info({ip}, cb)
    });
  }

  return async function({req, res, next}) {
    const {
      ip
    } = req.query;
    assert(ip, "ip is required");
    try {
      const infoResult = await cachingInfoLookup({ip});
      const spamResult = await cachingSpamLookup({ip});
      if (infoResult) {
        res.send({
          ...infoResult.value,
          spam: spamResult?.value,
        });
      }
      else {
        const err = `cant get info from ip: ${ip}`;
        debug(err);
        next(JSON.stringify({error: err}));
      }
    } catch(err) {
      debug(err.message);
      next(JSON.stringify({error: err.message}));
    }
  }
}
