
var conn = $.hdb.getConnection();
var query = 'SELECT "BOOKINGNUMBER","BAYNUMBER","REGO" FROM "Parking.Database::Tables.T_BOOKINGS"';
var rs = conn.executeQuery(query);
var body = rs;

$.response.setBody(body);
$.response.contentType = 'application/json';

$.response.status = $.net.http.OK;