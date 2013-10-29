/*
 *
 * Generates mobile tickets...
 * at the moment it is only Apple iOS pkpass for Passbook
 *
 */


var fs = require('fs');
var exec = require('child_process').exec;
var request = require('request');

var manifest_content = {};

module.exports = function (mongoose, shackleton_conn, app){


  //******************** ROUTE HANDLER **************************************

  app.get('/api/mobile_tickets/pkpass', function (req, res) {
    console.log('in GET /api/mobile_tickets/pkpass');
    console.log('querystring params are: ');
    console.log(req.query);

    //console.log('************ the req object is: **************');
    //console.log(req);

    //make a GET request to another application on heroku which is dedicated to making the
    //digital tickets.
    //the_james_caird app on heroku endpoint:
    var base_url = 'https://powerful-dawn-9566.herokuapp.com';
    //var base_url = 'http://localhost:5001';
    var path     = '/api/apple?';
    var _querystring =   'gig_id=' + req.query.gig_id 
                       + '&' 
                       + 'order_id=' + req.query.order_id 
                       + '&'
                       + 'order_first_name=' + req.query.order_first_name 
                       + '&'
                       + 'order_last_name=' + req.query.order_last_name 
                       + '&'
                       + 'order_main_event=' + req.query.order_main_event 
                       + '&'
                       + 'order_number_of_tickets=' + req.query.order_number_of_tickets 
                       + '&'
                       + 'order_transaction_status=' + req.query.order_transaction_status;

    console.log('calling THE_JAMES_BAIRD app, url: ' + the_url);
    var the_url = base_url + path  + _querystring;
    var WRK_DIR;

    //make a tmp dir for the streamed in pkpass
    create_tmp_dir();

    //Returns a random integer between min and max
    //Using Math.round() will give you a non-uniform distribution!
    function get_random_int(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }


    function create_tmp_dir() {
      WRK_DIR = './' + 'tmp' + get_random_int(1000, 9999) + '/';
  
      fs.readdir(WRK_DIR, function (err, files) {
        if (err) {
          //dir does not exist, cool. go onto the next step
          console.log(WRK_DIR + ' does not exist. GOOD');
  
          make_the_tmp_dir();
        } else {
          //dir does exist
          console.log(WRK_DIR + ' does exist. BAD, try another dir');
  
          //call this function again which will create a new random_int to use
          create_tmp_dir();
        }
      });
    }
  
  
    function make_the_tmp_dir() {
  
      fs.mkdir(WRK_DIR, function (err) {
        if (err) {
          console.log(err);
          return callback(err);
        } else {
          console.log('making ' + WRK_DIR + '  dir');
  
          //now get the list of all the files from S3 for the gig in question
          //get_the_list_of_files_from_s3();

          var the_pass = fs.createWriteStream(WRK_DIR + 'shackleton_pass.pkpass');
      
          //THE IMPORTANT: USING STREAMS: get the pkpass and give it back to client side
          //method chaining the Streams and event handlers
          request(the_url)
            .on('data', function (chunk) {
              console.log('DATA EVENT');
            })
            .on('end', function () {
              console.log('END EVENT');
              res.contentType('application/vnd.apple.pkpass');
              res.download(WRK_DIR + 'shackleton_pass.pkpass');
            })
            .pipe(the_pass);
      
        }
      });
    }




    /*
    //var the_pass = fs.createWriteStream('./' + 'tmp' + get_random_int(1000, 9999) +  
    //                                    + '/shackleton_pass.pkpass');
    var the_pass = fs.createWriteStream('./shackleton_pass.pkpass');

    //THE IMPORTANT: USING STREAMS: get the pkpass and give it back to client side
    //method chaining the Streams and event handlers
    request(the_url)
      .on('data', function (chunk) {
        console.log('DATA EVENT');
      })
      .on('end', function () {
        console.log('END EVENT');
        res.contentType('application/vnd.apple.pkpass');
        res.download('./shackleton_pass.pkpass');
      })
      .pipe(the_pass);
    */




    /*
    var request_read_stream = request(the_url); //output is a read Stream
    //now, get the pass and stream it to the_pass
    request_read_stream.pipe(the_pass);

    request_read_stream.on('data', function (chunk) {
      console.log('got data event');
    });

    request_read_stream.on('end', function (chunk) {
      console.log('got end event');

      //now that the file has been completely streamed to fs, send it back to the 
      //tikelt.me/shackleton app.
      //make sure to set the content-type header to be that for pkpass
      res.contentType('application/vnd.apple.pkpass');
      res.download('./shackleton_pass.pkpass');
    });
    */



    /*
    //THIS DOES NOT WORK. makes a pkpass much larger in size than expected resulting in
    //an unopenable file.
    //make the call to THE_JAMES_BAIRD app
    request(the_url,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {

          //TODO: how to handle this res type for an ajax call...
          //is the pkpass. content-type: application/vnd.apple.pkpass
          console.log('got a response from THE_JAMES_CAIRD app:');
          console.log('response.headers:');
          console.log(response.headers);
          console.log('body:::::');
          //console.log(body);

          //try to set the response header to have Access-Control-Allow-Origin: '*'
          //var blah = 'Access-Control-Allow-Origin';
          //response.headers[blah] = 'https://localhost:5000';

          fs.writeFile('./shackleton_pass.pkpass', body, function (err) {
            if (err) {
              throw err;
            }
            console.log('successfully created ./shackleton_pass.pkpass file');
 
          }); 
          
          //fs.createReadStream(body).pipe(the_pkpass);
          //return res.send(response);
          //return res.redirect(response.body);

        }
    });
    */

  });


}; // end module.exports
