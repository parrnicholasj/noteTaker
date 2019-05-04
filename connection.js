var mysql = require("mysql");

var connection;


if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
      host: "otwsl2e23jrxcqvx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "cedzozm69mkq1r3e",
      password: "xvxqqp8t0mtt3x78",
      database: "d0kyvzm56c70li9z"
    });
}

connection.config.typeCast = function(field, next) {
  if (field.type == "TINY" && field.length == 1) {
    return field.string() == "1"; 
  }
  return next();
};

module.exports = connection;