
var conn = $.hdb.getConnection();
var query = 'SELECT (10-count(*)) as a FROM "Parking.Database::Tables.T_BOOKINGS"';
var rs = conn.executeQuery(query);
console.log(rs);
var a = rs[0]["A"];

console.log(rs[0]["A"]);
console.log(a);
var body ='';
var body =  +rs[0]["A"] +   ' Parking Bays Available ';
body =JSON.stringify(body);
console.log(body);
var js = '{ "replies": [    {      "type": "text",      "content": ' +body+ '  }  ],  "conversation": {    "language": "en",    "memory": {      "user": "Bob"   }  }}';
var js_full = '{ "replies": [    {      "type": "text",      "content": "No Parking Bays Available"  }  ],  "conversation": {    "language": "en",    "memory": {      "user": "Bob"   }  }}';

//var js = '{ 'replies: [    {      type: text,      content: ' +body+ '  }  ],  conversation: {    language: en   , memory: {      user: Bob   }  }}';
console.log(js);
console.log(JSON.stringify(js));
if(rs[0]["A"] < 1) {$.response.setBody(js_full);}

	else { $.response.setBody(js) ;}

//$.response.setBody(body);
$.response.contentType = 'application/json';

$.response.status = $.net.http.OK;