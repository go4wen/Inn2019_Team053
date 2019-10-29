// get user id from request
try {
	var aCmd = $.request.body.asString();
	var obj=JSON.parse(aCmd);
	var NUSERID = obj.NUSERID ;
} catch(err) {
	var NUSERID = 999;
}

// Check parking available
var conn = $.hdb.getConnection();
var query = 'SELECT SUBURB, FIRST_NAME, MEETING FROM "Parking.Database::Tables.T_EMPLOYEE" WHERE USERID=\'' + NUSERID + '\'';
var rs = conn.executeQuery(query);   
var suburb = rs[0]["SUBURB"];
var suburb_url = suburb.replace(" ", "+");
var office = "484 St Kilda Road Melbourne";
var office_url = office.replace(" ", "+");
var first_name = rs[0]["FIRST_NAME"];
var meeting = rs[0]["MEETING"];

query = 'SELECT (16 - COUNT(*)) AS NUM_PARKING FROM "Parking.Database::Tables.T_BOOKINGS"'; 
rs = conn.executeQuery(query);
var num_parking = rs[0]["NUM_PARKING"];

// Check travel times from Google API
var google_dest = $.net.http.readDestination("GOOGLE_MAPS");
var google_client = new $.net.http.Client();
var google_req = new $.web.WebRequest($.net.http.GET, "/maps/api/directions/json?origin=" + suburb_url + "&destination=" + office_url + "&key=AIzaSyAguu3pLOT6EGS2mqafMbGvZTXpUC8l2J4");
google_client.request(google_req, google_dest);
var google_res = google_client.getResponse();
//console.log("Google API response: " + google_res.status);

var directions = JSON.parse(google_res.body.asString());
var time_car = directions.routes[0].legs[0].duration.value;
//console.log("time car (s): " + time_car);

google_req = new $.web.WebRequest($.net.http.GET, "/maps/api/directions/json?origin=" + suburb_url + "&destination=" + office_url + "&mode=transit&key=AIzaSyAguu3pLOT6EGS2mqafMbGvZTXpUC8l2J4");
google_client.request(google_req, google_dest);
var google_res = google_client.getResponse();
//console.log("Google API response: " + google_res.status);

var directions = JSON.parse(google_res.body.asString());
var time_pt = directions.routes[0].legs[0].duration.value;
//console.log("time transit (s): " + time_pt);

google_req = new $.web.WebRequest($.net.http.GET, "/maps/api/directions/json?origin=" + suburb_url + "&destination=" + office_url + "&mode=walking&key=AIzaSyAguu3pLOT6EGS2mqafMbGvZTXpUC8l2J4");
google_client.request(google_req, google_dest);
var google_res = google_client.getResponse();
//console.log("Google API response: " + google_res.status);

var directions = JSON.parse(google_res.body.asString());
var time_walk = directions.routes[0].legs[0].duration.value;
//console.log("time transit (s): " + time_pt);

var body_commute = [];

time_car  = Math.round(time_car/60);
time_pt   = Math.round(time_pt/60);
//var time_ride = 29;
time_walk = Math.round(time_walk/60);
var steps = time_walk * 120;

body_commute.push(first_name + ', your commute from ' + suburb + ' by car will take ' + time_car + ' minutes. Taking public transport would take ' + time_pt + ' minutes and if you decide to walk, it would take you ' + time_walk + ' minutes, but it would bring you ' + steps + ' steps closer to your target of 10000 steps per day. ');

// Pick a phrase
var pick = Math.floor(Math.random() * body_commute.length);
var body = body_commute[pick];

if (num_parking > 3) {
	body = body + ' There are ' + num_parking + ' parking spots availble in the office. Do you want to reserve a bay, or use some more ecological way to commute?';
} 
else if (num_parking > 0) {
	body = body + ' There is very limited parking available in the office. I can offer you a 5 dollar appreciate award if you leave your car at home today!';
}
else {
	body = body + ' There is unfortunately no space available in the office parking today. Why don\'t you get your rusty push bike out of the shed?';
}
//You have a mandatory meeting in your calendar at 3.15pm so you better get your lazy bum to the office today.
//Your commute by car will take 45 minutes. Taking public transport will take 55 minutes but would get you
//1850 steps closer to your daily walking target of 8000 steps.
//There is plenty of parking available at the office. Do you want me to reserve a bay?

var json = {};
json.replies = [];
json.replies.push({type: "text", content: body});
json.conversation = {
	language: "en",
	memory: {
		user_name: first_name,
		user_id: NUSERID,
		user_meeting: meeting,
		user_numparking: num_parking 
	}
};

$.response.setBody(JSON.stringify(json));
$.response.contentType = 'application/json';
$.response.status = $.net.http.OK;