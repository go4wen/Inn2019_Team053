// Check parking available
var conn = $.hdb.getConnection();
var query = 'SELECT (16 - COUNT(*)) AS NUM_PARKING FROM "Parking.Database::Tables.T_BOOKINGS"'; 
var rs = conn.executeQuery(query);   
var num_parking = rs[0]["NUM_PARKING"];
var meeting = true;

var body_meeting = [];
if (meeting) {
	var time_hour = Math.ceil(Math.random() * 8)+9;
	var time_minute = Math.floor(Math.random() * 4) * 15;
	if (time_hour < 12) {
		var time_hour_suffix = 'am';
	} else if (time_hour == 12) {
		var time_hour_suffix = 'pm';
	} else {
		var time_hour_suffix = 'pm';
		time_hour = time_hour - 12;
	}
	if (time_minute == 0) {
		var time_minute_text = '00';
	}
	else {
		var time_minute_text = time_minute.toString();
	}
	var time_meeting = time_hour + '.' + time_minute_text + '' + time_hour_suffix;

	body_meeting.push('There is a meeting in your calendar at ' + time_meeting + ' which you have to attend in person so you better get your lazy bum to the office today');
	body_meeting.push('I found a meeting in Outlook at ' + time_meeting + ' which is marked with attendance required so how about enjoying some Melbourne traffic?');
	body_meeting.push('You have a one on one meeting with your manager at ' + time_meeting + '. Your bonus will be calculated in 2 months so I recommend to show up in the office');
} else {
	body_meeting.push("You are lucky all of your meetings are flagged as online meetings today.");
	body_meeting.push("Based on your calendar nobody want's to meet you in person today. Don't worry I still like you!");
}
// Pick a phrase
var pick = Math.floor(Math.random() * body_meeting.length);
var body = body_meeting[pick];

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
		user: num_parking
	}
};

$.response.setBody(JSON.stringify(json));
$.response.contentType = 'application/json';
$.response.status = $.net.http.OK;