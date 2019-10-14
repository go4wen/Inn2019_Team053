const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAguu3pLOT6EGS2mqafMbGvZTXpUC8l2J4'
});

googleMapsClient.distanceMatrix({
        origins: [
                '168 Walker St., North Sydney'
        ],
        destinations: [
                '1 Woolworths Way, Bella Vista'
        ],
        mode: 'driving',
}, function(err, res) {
  if (!err) {
        console.log('no error');
        $.response.contentType = 'application/json'
        $.response.setBody(res.json);
        $.response.status = $.net.http.OK;
  }
});