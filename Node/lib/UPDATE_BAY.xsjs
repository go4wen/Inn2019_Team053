$.response.contentType = "application/json";
var body='';
var aCmd = $.request.body.asString( );
var obj=JSON.parse(aCmd);

var NSTATUS= obj.NSTATUS ;
var NREGO= obj.NREGO ;
var NBAY= obj.NBAY ;

function getTxtData()
{
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
  
    tx_data_query ='UPDATE "Parking.Database::Tables.T_BOOKINGS" SET STATUS = '+NSTATUS+' WHERE   BAYNUMBER = '+NBAY+' and REGO = ? ';
   
    
   try
    {
     statement = connection.prepareStatement(tx_data_query);
     statement.setString(1,NREGO);
    console.log(statement);
    resultSet= statement.executeQuery(tx_data_query);
    
    connection.commit();
    } finally {
   statement.close();
    connection.close();
    }
    return resultSet;
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
