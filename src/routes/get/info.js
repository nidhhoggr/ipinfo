module.exports = (app) => {

  debug = app.modules.debug('routes:info');

  return async function({req, res, next}) {
    const {
      ip
    } = req.query;
    assert(ip, "ip is required");
    try {
      const result = await app.modules["ipgeolocation"].infoAsync({ip});
      debug(result);
      res.send(result);
    } catch(err) {
      debug(err.message);
      next(err);
    }
  }
}
