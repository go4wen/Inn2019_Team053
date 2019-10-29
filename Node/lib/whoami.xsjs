$.response.contentType = "application/json";
var body='';

try {
	var aCmd = $.request.body.asString( );
	console.log(aCmd);
	var obj=JSON.parse(aCmd);
	var NUSERID = obj.NUSERID ;
} catch(err) {
	var NUSERID = 999;
}

var conn = $.hdb.getConnection();
var query = 'SELECT FIRST_NAME FROM "Parking.Database::Tables.T_EMPLOYEE" WHERE USERID=\'' + NUSERID + '\'';
var rs = conn.executeQuery(query);   
if (rs.length > 0) {
	var text_name = rs[0]["FIRST_NAME"];
} else {
	var text_name = 'unknown Unicorn';
}

var body = 'Thank you ' + text_name + '! I can help you finding the smartest way to work today!'

var json = {};
json.replies = [];
json.replies.push({type: "text", content: body});
json.conversation = {
	language: "en",
	memory: {
		user_name: text_name,
		user_id: NUSERID
	}
};

$.response.setBody(JSON.stringify(json));
$.response.contentType = 'application/json';
$.response.status = $.net.http.OK;
 