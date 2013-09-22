// email service for the app
// currently using Mandrill addon from heroku



var Mandrill = require('mandrill-api').Mandrill;
var m = new Mandrill(process.env.MANDRILL_APIKEY);



var welcome_email = function (first_name, user_email_address) {
    console.log('EMAIL: in welcome_email function');
    var email_body = '__INSERT IMAGE__\n\n' + 
                     'Welcome to Tiklet!\n' +
                     'Tiklet makes buying tickets to gigs easy, secure and fast.' +
                     'Now your\'re all set to instantly search and securely buy ' +
                     'tickets to any of our shows.\n' +
                     'Login to your account using your email address, ' + 
                     user_email_address + ', and password, to start purchasing tickets' +
                     ' and check any account details.\n' + 
                     'Please contact us with questions or feedback at ' +
                     'admin@tiklet.me. We can\'t wait to hear from you!' +
                     'Happy gigging,' +
                     'Your friends @Tiklet';
    var params = {
      "message": {
          "from_email":"admin@tiklet.me",
          "from_name":"Tiklet.me",
          "to":[{"email":user_email_address}],
          "subject": "Welcome to Tiklet.me, " + first_name + "!",
          //"text": email_body,
          'html': "<img src=\"https://s3-ap-southeast-2.amazonaws.com/biz.spintix.bucket1/img/112by112placeholder.jpg\" alt=\"Tiklet\" />" + 

                  "<div>Welcome to Tiklet!</div>" + 
                  "<div>Tiklet makes buying tickets to gigs easy, secure and fast. " + 
                  "Now you\'re all set to instantly search and purchase tickets to " + 
                  "any of our shows.</div>" +
                  "<div>Login to your account using your email address, " + 
                  user_email_address +
                  ", and password, to start purchasing tickets and " + 
                  "check any account details.</div>" +
                  "<div>Please contact us with any questions or feedback at " + 
                  "admin@tiklet.me. We can\t wait to hear from you!</div>" +
                  "<div>Happy gigging, </div>" +
                  "<div>Your friends @Tiklet</div>"
      }
    };
  m.messages.send(params, function (result) {
    console.log('EMAIL: result: ');
    console.log(result);
   }, 
   function (err) {
    console.log('EMAIL: error: ');
    console.log(err);
  });
};




var welcome_email_with_body = function (first_name, user_email_address, body) {
    console.log('EMAIL: in welcome_email function');
    var params = {
      "message": {
          "from_email":"admin@tiklet.me",
          "from_name":"Tiklet Ticketing",
          "to":[{"email":user_email_address}],
          "subject": "Welcome to Tiklet.me ticketing services",
          "text": body.mandrill_events 
      }
    };
  m.messages.send(params, function (result) {
    console.log('EMAIL: result: ');
    console.log(result);
   }, 
   function (err) {
    console.log('EMAIL: error: ');
    console.log(err);
  });
};




exports.send_welcome_email = welcome_email;
exports.send_welcome_email_with_body = welcome_email_with_body;








// EXPERIMENTAL START--------------------------------------------
/*

//var Mandrill = require('mandrill').Mandrill;
//var m = new Mandrill('5HglHXoENH6oVY7TFSPbZw');
var m = new Mandrill(process.env.MANDRILL_APIKEY);
m.users.info({}, function(info) {
    console.log('MANDRILL:');
    console.log(info);
    console.log('Reputation: ' + info.reputation + ', Hourly Quota: ' + info.hourly_quota)
;
});

m.users.ping2({}, function(result) {
    console.log('pinging to validate the API key and respond to ping');
    console.log(result);
}, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Invalid_Key - Invalid API key
});

m.users.senders({}, function(result) {
    console.log('find the senders that have used this account');
    console.log(result);
}, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Invalid_Key - Invalid API key
});

var message = {
    "html": "<p>Example HTML content</p>",
    "text": "Example text content",
    "subject": "example subject",
    "from_email": "message.from_email@example.com",
    "from_name": "Example Name",
    "to": [{
            "email": "andre@spinninghalf.com.au",
            "name": "Andre Trosky"
        }],
    "headers": {
        "Reply-To": "message.reply@example.com"
    },
    "important": false,
    "track_opens": null,
    "track_clicks": null,
    "auto_text": null,
    "auto_html": null,
    "inline_css": null,
    "url_strip_qs": null,
    "preserve_recipients": null,
    "view_content_link": null,
    "bcc_address": "message.bcc_address@example.com",
    "tracking_domain": null,
    "signing_domain": null,
    "return_path_domain": null,
    "merge": true,
    "global_merge_vars": [{
            "name": "merge1",
            "content": "merge1 content"
        }],
    "merge_vars": [{
            "rcpt": "andre@spinninghalf.com.au",
            "vars": [{
                    "name": "merge2",
                    "content": "merge2 content"
                }]
        }],
    "tags": [
        "password-resets"
    ],
    "subaccount": "customer-123",
    "google_analytics_domains": [
        "example.com"
    ],
    "google_analytics_campaign": "message.from_email@example.com",
    "metadata": {
        "website": "www.example.com"
    },
    "recipient_metadata": [{
            "rcpt": "andre@spinninghalf.com.au",
            "values": {
                "user_id": 123456
            }
        }],
    "attachments": [{
            "type": "text/plain",
            "name": "myfile.txt",
            "content": "ZXhhbXBsZSBmaWxl"
        }],

    "images": [{
            "type": "image/png",
            "name": "IMAGECID",
            "content": "ZXhhbXBsZSBmaWxl"
        }]

};

var async = false;
var ip_pool = "Main Pool";
var send_at = "2013-09-21 00:44:19";
m.messages.send({
  "message": message,
  "async": async,
  "ip_pool": ip_pool,
  "send_at": send_at
  },
   function(result) {
    console.log(result);
}, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'c
ustomer-123'
});

*/


// EXPERIMENTAL END--------------------------------------------
