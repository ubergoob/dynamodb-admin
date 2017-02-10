var fs = require('fs');

function load_config () {

  try {
    fs.accessSync('aws.json');
    var aws_config = require('../../aws.json');
  } catch (e) {
    var aws_config = {
      accessKeyId: '',
      secretAccessKey: '',
      endpoint: '',
      region: '',
      sslEnabled: true,
      tables: { "TableNames": []},
      prefix: ""
    };
  } finally {
    // We will override any values from a config file if we find linked aws services
    try {var vcapObj = JSON.parse(process.env.VCAP_SERVICES)} catch (e) {};
    try { aws_config.accessKeyId = vcapObj['aws-dynamodb'][0].credentials.access_key_id ; } catch (e) {}
    try { aws_config.secretAccessKey = vcapObj['aws-dynamodb'][0].credentials.secret_access_key;} catch (e) {}
    try { aws_config.region = vcapObj['aws-dynamodb'][0].credentials.region;
          aws_config.sslEnabled = true;
          delete aws_config.endpoint;
          aws_config.prefix = vcapObj['aws-dynamodb'][0].credentials.prefix;
    } catch (e) {}
    try { var tables = JSON.parse(process.env.TABLE_NAMES);
          if (Array.isArray(tables)) {
            tables.forEach(function(table){aws_config.tables.TableNames.push(aws_config.prefix+table);});
          }
      } catch (e) {};
    return aws_config;
  }



}

module.exports = {
  load_config: load_config
}