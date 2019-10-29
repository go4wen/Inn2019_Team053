// get user id from request
try {
	var aCmd = $.request.body.asString();
	var obj=JSON.parse(aCmd);
	var NUSERID = obj.NUSERID ;
} catch(err) {
	var NUSERID = 999;
}

var conn = $.hdb.getConnection();
var rs;
var rego = "";
var first_name = "";
var tx_data_query1 ='select CC_1 as a from "next_bay"';
try {
	rs =  conn.executeQuery(tx_data_query1);
    var bay_free = rs[0]["A"];
  	tx_data_query ='call "BOOK.HDBPROCEDURE"(?,?)';
    rs = conn.executeQuery(tx_data_query, bay_free, NUSERID);
    conn.commit();

	var query = 'SELECT FIRST_NAME, REGO FROM "Parking.Database::Tables.T_EMPLOYEE" WHERE USERID=\'' + NUSERID + '\'';
	rs = conn.executeQuery(query);   
	rego = rs[0]["REGO"];
	first_name = rs[0]["FIRST_NAME"];
} 
finally {
	conn.close();
}

var body_bay = [];
	
body_bay.push('Bay ' + bay_free + ' has been pre-booked for your car with rego ' + rego + '! A booking confirmation will also be sent to you via SMS.');
body_bay.push(first_name + ' I have booked bay number ' + bay_free + ' for your car ' + rego + '! Have a safe trip to the office and please watch your fuel economy.');
body_bay.push('Bay number ' + bay_free + ' has been pre-booked for your car ' + rego + ', ' + first_name + '! Please drive safe and don\'t speed again.');

var sms_dest = $.net.http.readDestination("SMS");
var sms_client = new $.net.http.Client();
var sms_req = new $.web.WebRequest($.net.http.GET, "/rfcmail?value=1&metrictext=" + bay_free + "&userid=" + first_name);
//var sms_req = new $.web.WebRequest($.net.http.GET);
sms_client.request(sms_req, sms_dest);
var sms_res = sms_client.getResponse();
console.log("response " + sms_res.status);

// Pick a phrase
var pick = Math.floor(Math.random() * body_bay.length);
var body = body_bay[pick];
    
var json = {};
json.replies = [];
json.replies.push({type: "text", content: body});
json.conversation = {
	language: "en",
	memory: {
		user_name: first_name,
		user_id: NUSERID,
		user_rego: rego,
		user_bay: bay_free
	}
};

$.response.setBody(JSON.stringify(json));
$.response.contentType = 'application/json';
$.response.status = $.net.http.OK;