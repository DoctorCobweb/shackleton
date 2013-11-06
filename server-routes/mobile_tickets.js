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
    //var base_url = 'https://powerful-dawn-9566.herokuapp.com';
    //console.log('THE_JAMES_CAIRD: the base_url: '
    //            + 'https://powerful-dawn-9566.herokuapp.com');
    var base_url = 'http://localhost:5001';
    console.log('THE_JAMES_CAIRD: base_url: http://localhost:5001');
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

    var the_url = base_url + path  + _querystring;
    console.log('calling THE_JAMES_BAIRD app, url: ' + the_url);
    var WRK_DIR; //this will be something like tmp3476 (tmp with random int suffix)

    //make a tmp dir for the streamed in pkpass
    //you dont want to make the pkpasses all in the same dir because if a request comes
    //in for a new pkpass whilst one is already being made it will overwrite the contents
    //better to make a tmp dir, do your stuff, after success then remove tmp dir
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
  
          var the_pass = fs.createWriteStream(WRK_DIR + 'shackleton_pass.pkpass');
      
          //THE IMPORTANT: USING STREAMS: get the pkpass and give it back to client side
          //method chaining the Streams and event handlers
          //nb. using the callback in request(url, callback) doesnt seem to 
          //work for me, it resulted in a much larger file being transferrer. 
          //because of headers being included also?
          request(the_url)
            .on('data', function (chunk) {
              console.log('request(the_url) Read stream: DATA EVENT');
            })
            .on('end', function () {
              console.log('request(the_url) Read stream: END EVENT');
              res.contentType('application/vnd.apple.pkpass');
              res.download(WRK_DIR + 'shackleton_pass.pkpass', function (err) {
                if(err) {
                  return callback(err); 
                }
                rm_the_tmp_dir();
              });
            })
            .pipe(the_pass);
      
        }
      });
    }



    function rm_the_tmp_dir() {
      console.log('attempting to remove the tmp dir and its contents: ' + WRK_DIR);

      //SYNC HACK. does it intro bug?
      var files_in_tmp = [];
      console.log('reading dir..');
      files_in_tmp = fs.readdirSync(WRK_DIR);

      for (var l in files_in_tmp) {
        console.log(files_in_tmp[l]);
        fs.unlinkSync(WRK_DIR + files_in_tmp[l]);
      }
      fs.rmdirSync(WRK_DIR);
    }


  });


}; // end module.exports
