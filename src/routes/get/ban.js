const assert = require("assert");

module.exports = (app) => {

  debug = app.modules.debug('routes:ban');

  function cachingBanLookup({ip} = {}) {
    return app.modules.cache.getAsync({
      key: `ban:${ip}`,
      setterFn: (cb) => cb(undefined, ip)
    });
  }

  return async function({req, res, next}) {
    const {
      ip
    } = req.query;
    debug('calling ban for ', ip)
    assert(ip, "ip is required");
    try {
      const banResult = await cachingBanLookup({ip});
      if (banResult) {
        res.send({
          ip: banResult
        });
      }
      else {
        const err = `cant get ban info from ip: ${ip}`;
        debug(err);
        next(JSON.stringify({error: err}));
      }
    } catch(err) {
      debug(err.message);
      next(JSON.stringify({error: err.message}));
    }
  }
}
