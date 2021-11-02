const assert = require("assert");

module.exports = (app) => {

  debug = app.modules.debug('routes:info');

  function is_valid_response(response) {
    return !!response.city;
  }

  return async function({req, res, next}) {
    const {
      ip
    } = req.query;
    assert(ip, "ip is required");
    try {
      let i, module;
      for (i in app.config.modules) {
        module = app.config.modules[i];
        const result = await app.modules[module].infoAsync({ip});
        debug(result);
        if (is_valid_response(result)) {
          res.send(result);
          break;
        }
      }
    } catch(err) {
      debug(err.message);
      next(err);
    }
  }
}
