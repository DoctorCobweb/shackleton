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

  //querystring is gig=.....&order=......
  app.get('/api/mobile_tickets/pkpass', function (req, res) {
    console.log('in GET /api/mobile_tickets/pkpass');
    console.log('querystring params are: ');
    console.log(req.query);

    //use gig_id and order_id to find the correct bucket and directory (in bucket) on
    //AWS S3.
    //use request module to make http requests from this app to the pkpass app.

    //need to make a server on AWS or Heroku which has nodejs installed, openssl,
    //aws-sdk. it is used only to make pkpasses, write/read to S3 amd send back finished
    //pkpass for user.
    //reads the relevant folder on S3 for the gig
    //makes the pkpass
    //saves the finished pkpass in a dir under the gig S3 bucket + sends back to 
    //tiklet.me app (which then sends back to user clientside)
    //
    //concerns:
    //ephemeral filesystem -> should we use a EBS instance storage in order to make it
    //safer/more resilient to process crashes. i dont quite know what im talking about
    //here.
    //pkpass_server->EBS->S3 storage?
    //

    //console.log('************ the req object is: **************');
    //console.log(req);


    //make a GET request to another application on heroku which is dedicated to making the
    //digital tickets.

    //the_james_caird app on heroku endpoint:
    //var base_url = 'https://powerful-dawn-9566.herokuapp.com';
    var base_url = 'http://localhost:5001';
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




    //THE IMPORTANT PART: get the pkpass and give it back to client side
    var the_pass = fs.createWriteStream('./shackleton_pass.pkpass');
    var request_read_stream = request(the_url);

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






  //******************** ROUTE HANDLER **************************************

  //querystring is gig=.....&order=......
  app.get('/api/mobile_tickets/pkpass_link', function (req, res) {
    console.log('in GET /api/mobile_tickets/pkpass_link');
    console.log('querystring params are: ');
    console.log(req.query);

    //console.log('************ the req object is: **************');
    //console.log(req);


    //make a GET request to another application on heroku which is dedicated to making the
    //digital tickets.

    //the_james_caird app on heroku endpoint:
    //var base_url = 'https://powerful-dawn-9566.herokuapp.com';
    var base_url = 'http://localhost:5001';
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
          console.log(body);

          //try to set the response header to have Access-Control-Allow-Origin: '*'
          //var blah = 'Access-Control-Allow-Origin';
          //response.headers[blah] = 'https://localhost:5000';

          var the_pkpass = fs.createWriteStream('./shackleton_pass.pkpass'); 
          b.createReadStream().pipe(the_pkpass);

          //console.log('response.body: ' + response.body); 

          /*
          //get url, save the pass to fs, res.dowload(the file),
          request(body, function (e, r, b) {
            if (!e && r.statusCode == 200) {
              
              console.log('2nd response: ');
              console.log(r);


              fs.writeFile('./blah.pkpass', b, function (err){
                if (err) {
                  throw(err);
                } 
                console.log('thie pkpass is saved to shackleton fs');

                res.contentType('application/vnd.apple.pkpass');
                return res.download('./blah.pkpass');

              });
            }
          });
          */
          


        }
    })

  });














  /*
  //******************** ROUTE HANDLER **************************************

  //TODO: refactor this to get rid of waterfall code.
  app.get('/api/etix/pkpass/:gig_id', function (req, res) {

    var pass_name = req.params['gig_id'] + '.pkpass';

    //the directory relative to shackelton/ to execute commands.
    //will/should be different for different pkpasses but for now its 
    //hardcoded during demoing stage
    var wrk_dir = './etix/apple/' + req.params['gig_id'] + '/';
 

    //-------------------------------------------------------------------------
    //BUG?: what happens if manifest.json has not been completely created
    //and the .pkpass routines finish before that? incomplete manifest.json
    //file -> invalid pass! callback embedding of these 2 procedures..?
    //create the manifest.json file programatically
    fs.readdir(wrk_dir, function(err, names){
    
      //compute hash of pass.json file
      exec('openssl sha1 pass.json', {cwd: wrk_dir}, function(err, stdout, stderr){
        if(!err) {
          console.log('hello from pass.json sha1 block');
       
          var content = stdout;
          var start_index_of_hash = content.indexOf('=') + 2
          var hash = content.substring(start_index_of_hash, content.length - 1); 
      
          //put the (pass.json, hash) pair into the manifest_content object
          manifest_content["pass.json"] = hash;
        } else {
          console.log('Pkpass:[' + req.params['gig_id'] 
            + ']' + 'OPENSSL_ERROR: Unable to sha1 pass.json file.' + err);
        }
      });
    
      console.log('Pkpass:[' + req.params['gig_id'] 
        + ']' + 'The current directory contains image files:');
    
      for(var i = 0; i < names.length; i++) {
        if (names[i].indexOf('.png') >= 0){
          console.log('Pkpass:[' + req.params['gig_id'] + ']' + names[i]);
          exec('openssl sha1 ' + names[i], {cwd: wrk_dir}, function(err, stdout, stderr){
            if(!err){
              //console.log('stdout: ' + stdout);
              //console.log('names: ' + names[i]);
  
              var content = stdout;
              var start_index_of_hash = content.indexOf('=') + 2
              var left_brace = content.indexOf('(');
              var right_brace = content.indexOf(')');
        
              
              //also, strip the newline character from end of hash.
              var hash = content.substring(start_index_of_hash, content.length - 1);
              var file_name = content.substring(left_brace + 1, right_brace);
        
  
              //put the (file_name, hash) pair into the manifest_content obj.
              manifest_content[file_name] = hash;

              console.log('Pkpass:[' + req.params['gig_id'] + ']' 
                + 'manifest_content.' + file_name + '=' + manifest_content[file_name]);  

              fs.writeFile( wrk_dir + 'manifest.json', JSON.stringify(manifest_content), 
                function(err){
        	      if (err) {
        	        throw err;
        	      } else {
        	        console.log('Pkpass:[' + req.params['gig_id'] 
                          + ']' + 'FILE_SAVED: manifest.json');
                } //end if-else file saved OK
              }); //end writeFile manifest.json
            } else {
              console.log('Pkpass:[' + req.params['gig_id'] 
                + ']' + 'OPENSSL_ERROR: Unable to sha1 ' + names[i] + ' file.');
            }
          }); //end calc sha1 for .png files
        } //end if-names end in .png
      } //end for-loop 
    }); //end fs.readdir 
  
    //--------------------------------------------------------------------------
  
  
  
  
    //create a .pkpass pass using Openssl and  Certificates.p12, WWDR.pem files
    //export Certificates.p12 into a different format, passcertificate.pem
    exec("openssl pkcs12 -in Certificates.p12 -clcerts -nokeys -out passcertificate.pem -passin pass:", {cwd: wrk_dir}, function(err, stdout, stderr){
      if(!err){
        var content = stdout;
        console.log('Pkpass:[' + req.params['gig_id'] + ']' + 'OPENSSL_SUCCESS: Certificates.p12 -> passcertificate.pem');
   
        //export the key as a separate file, passkey.pem
        exec("openssl pkcs12 -in Certificates.p12 -nocerts -out passkey.pem -passin pass: -passout pass:12345", {cwd: wrk_dir}, function(err, stdout, stderr){
          if(!err){
            var content = stdout;
            console.log('Pkpass:[' + req.params['gig_id'] 
              + ']' + 'OPENSSL_SUCCESS: Certificates.p12 -> passkey.pem');
  
            //create the signature file.
            exec("openssl smime -binary -sign -certfile WWDR.pem -signer passcertificate.pem -inkey passkey.pem -in manifest.json -out signature -outform DER -passin pass:12345", {cwd: wrk_dir}, function(err, stdout, stderr){
              if(!err){
                var content = stdout; 
                console.log('Pkpass:[' + req.params['gig_id'] 
                  + ']' + 'OPENSSL_SUCCESS: Created the signature file.');
                
                //finally, create the .pkpass zip file, freehugcoupon.pkpass
                exec("zip -r " + pass_name + " manifest.json pass.json signature logo.png logo@2x.png icon.png icon@2x.png strip.png strip@2x.png", {cwd: wrk_dir}, function(err, stdout, stderr){
                  if(!err){
                    var content = stdout;
                    console.log('Pkpass:[' + req.params['gig_id'] + ']' + stdout);
                    console.log('Pkpass:[' + req.params['gig_id'] 
                      + ']' + 'ZIP_SUCCESS: Created the .pkpass file.');
              
  
                    //check to see if the file exists before allowing it to be downloaded.
                    fs.exists( wrk_dir + pass_name, function(exists){
                      if (exists){
  
                        //you must set the mime type for the content to respond with
                        //so safari can recognize it. 
                        //does this also work for other mobile browsers? 
                        //e.g. mobile chrome browser on iphone? 
                        res.contentType('application/vnd.apple.pkpass');
  
                        //DELIVER THE FINAL PRODUCT: the pass !!!
                        res.download( wrk_dir + pass_name);
                      } else {
                        console.log('Pkpass:[' + req.params['gig_id'] 
                          + ']' + pass_name + ' does not exist, yet.');
                      }
                    });
                  } else {
                    console.log('Pkpass:[' + req.params['gig_id'] + ']' 
                      + 'ZIP_ERROR: Could not create the .pkpass file.');
                  }    
                }); //end zip exec
              } else {
                console.log('Pkpass:[' + req.params['gig_id'] + ']' 
                  + 'OPENSSL_ERROR: Could not make signature file.');
              }
            });
          } else {
            console.log('Pkpass:[' + req.params['gig_id'] + ']' 
              + 'OPENSSL_ERROR: Could not make passkey.pem');
          }
        });
      } else {
        console.log('Pkpass:[' + req.params['gig_id'] + ']' 
          + 'OPENSSL_ERROR: Could not make passcertificate.pem'+ stderr);
      }
    });
  }); // end app.get
  */




}; // end module.exports