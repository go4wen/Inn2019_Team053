
var conn = $.hdb.getConnection();
var query = 'SELECT (10-count(*)) as a FROM "Parking.Database::Tables.T_BOOKINGS"';
var rs = conn.executeQuery(query);
console.log(rs);
var a = rs[0]["A"];

console.log(rs[0]["A"]);
console.log(a);
var body ='';
var body = rs[0]["A"] + '  Bays Available';

if(rs[0]["A"] < 1) {$.response.setBody('No Bays Available');}

	else { $.response.setBody(body) ;}

//$.response.setBody(body);
$.response.contentType = 'application/json';

$.response.status = $.net.http.OK;