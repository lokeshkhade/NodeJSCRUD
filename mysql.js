
var mysql = require('mysql');
var config = require('config');




var exec = function (query, params, callback) {
  if (!query) {
    return callback("Query not found");
  }
  var connection = mysql.createConnection({
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.database'),

    multipleStatements: true
  });

  connection.connect(function (err) {
    if (err) {
      return callback(err);


    }

    var q = connection.query(query, params, function (err, results) {
      connection.end();
      if (err) { return callback(err); }
      return callback(null, results);
    });



  });
};

module.exports.exec = exec;