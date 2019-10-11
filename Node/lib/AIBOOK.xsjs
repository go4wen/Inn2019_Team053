$.response.contentType = "application/json";
var body='';
var aCmd = $.request.body.asString( );
var obj=JSON.parse(aCmd);

var NUSERID= obj.NUSERID ;
console.log(NUSERID);
function getTxtData()
{
    var connection = $.hdb.getConnection();

    var statement = '';
   
    var resultSet = '';
   
  
  
  tx_data_query1 ='select CC_1 as a from "next_bay"';
   try
    {
   
    console.log(statement);
    
    resultSet =  connection.executeQuery(tx_data_query1);
    console.log(resultSet);
    console.log('array');
    var BAY = resultSet[0]["A"];
    console.log(BAY);
    
    tx_data_query ='call "BOOK.HDBPROCEDURE"(?,?)';
 
    
    resultSet =  connection.executeQuery(tx_data_query,resultSet[0]["A"],NUSERID);
    
    connection.commit();
     
    } finally {

    connection.close();
   
    }

    var body_BAY = 'Bay ' +BAY + ' booked for you, Booking confirmation will also be sent to you via SMS.';
    body_BAY =JSON.stringify(body_BAY);
   console.log(body_BAY);
    //return body_BAY;
    var js = '{ "replies": [    {      "type": "text",      "content": ' +body_BAY+ '  }  ],  "conversation": {    "language": "en",    "memory": {      "user": "Bob"   }  }}';
console.log(js);
console.log(JSON.stringify(js));
 


return js;
}
function doGet()
{
          try
          {
          $.response.contentType = "application/json";  $.response.contentType = "text/plain";  $.response.setBody(getTxtData());
          }  catch(err) {
             $.response.contentType = "text/plain";  $.response.setBody("Error while executing query: [" +err.message +"]");  $.response.returnCode = 200;
          }
}
doGet();
