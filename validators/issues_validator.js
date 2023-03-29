//Create a validator for the issues endpoint

// Path: validators/issues_validator.js
module.exports = function(req, res, next) {
  //validate the request body had issues, issues is an array of strings
  if (!req.body.hasOwnProperty('issues')) {
    res.status(400).json({status: 'error', message: 'Missing issues array'});
    return;
  }
  if (!Array.isArray(req.body.issues)) {
    res.status(400).json({status: 'error', message: 'Issues is not an array'});
    return;
  }
  if (req.body.issues.length === 0) {
    res.status(400).json({status: 'error', message: 'Issues array is empty'});
    return;
  }
  next();
};
