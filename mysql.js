
var mysql = require('mysql');
var config = require('config');




var exec = function (query, params, callback) {
  if (!query) {
    callback("Query not found");
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
      callback(err);
      return;
    }

    var q = connection.query(query, params, function (err, results) {
      connection.end();
      if (err) {  callback(err); return; }
      return callback(null, results);
    });

    connection.end();

  });
};

module.exports.exec = exec;