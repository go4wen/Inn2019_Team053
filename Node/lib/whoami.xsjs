$.response.contentType = "application/json";
var body='';
var aCmd = $.request.body.asString( );
var obj=JSON.parse(aCmd);

var NUSERID = obj.NUSERID ;

var conn = $.hdb.getConnection();
var query = 'SELECT FIRST_NAME FROM "Parking.Database::Tables.T_EMPLOYEE" WHERE USERID='+NUSERID;
var rs = conn.executeQuery(query);   
var text_name = rs[0]["FIRST_NAME"];
//var text_name = 'Sven'; 
var body = 'Thank you ' + text_name + '! I can help you finding the smartest way to work today!'

var js = '{ "replies": [    {      "type": "text",      "content": ' +body+ '  }  ],  "conversation": {    "language": "en",    "memory": {      "user": ' +text_name+ '   }  }}';

$.response.setBody(js);
$.response.contentType = 'application/json';
$.response.status = $.net.http.OK;
 