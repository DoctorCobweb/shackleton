//var newrelic = require('newrelic');
/*
 *
 *
 * SHACKLETON SERVER - express app using mongoDB, redis for persistence layer.
 *
 * 
 */
//
//MODULE DEPENDENCIES:
var application_root = __dirname,
    express = require('express'),
    path = require('path'),
    format = require('util').format,
    fs = require('fs'),
    https = require('https'),
    mongoose = require('mongoose'),
    RedisStore = require('connect-redis')(express),
    //redis = require('redis'),
    email_services = require('./services/email_services'),
    express_validator = require('express-validator'),
    AWS = require('aws-sdk');
    //request = require('request');



//setup AWS stuff
AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID,
                   "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
                   "region": process.env.AWS_REGION});



//The http server will listen to an appropriate port, or default to
//port 5000.
var port = process.env.PORT || 5000;
console.log('process.env.PORT: ' + process.env.PORT);



if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  console.log('REDISTOGO: rtg: ' + rtg);
  console.log('REDISTOGO: rtg.port: ' + rtg.port);
  console.log('REDISTOGO: rtg.hostname: ' + rtg.hostname);

  var redis_client = require("redis").createClient(rtg.port, rtg.hostname);
  redis_client.auth(rtg.auth.split(":")[1]); 
  console.log('REDISTOGO: rtg.auth: ' + rtg.auth.split(":")[1]);

  var redis_store = new RedisStore({client: redis_client});  

} else {
  var redis_store = new RedisStore();
}



//define the uri string for connecting to the mongo db for this app,
//called 'shackleton_database'
var mongo_uri = 
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL  ||
  'mongodb://localhost/shackleton_database';




//create the ONE connection to the shackleton_database.
//one connection, many collections representing each area of the app
//i.e. a gigs collection, users collection, passwords collection etc
var shackleton_conn = mongoose.connect(mongo_uri, function (err, res) {
  if (err) {
    console.log('ERROR in connecting to ' + mongo_uri + '.' + err);
  } else {
    console.log('SUCCESS in connecting to ' + mongo_uri);
  }
});




//put the schemas here so we can send them around to different route handler groups
var TagNames = new mongoose.Schema({
  tag: String
});



var Gig = new mongoose.Schema({
  main_event:        String,
  event_date:        Date,
  opening_time:      String,
  venue:             String,
  price:             Number,
  supports:          String,
  age_group:         String,
  description:       String,
  tag_names:         [TagNames],
  main_image_url:    String,
  thumbnail_url:     String,
  capacity:          Number
  //image_url:       String
});



//simple but incomplete email regexp used for User schema validation of emailAddress
var emailRegexp = /.+\@.+\..+/;



var User = new mongoose.Schema({
  first_name:                  {type: String, required: true},
  last_name:                   {type: String, required: true},
  email_address:               {type: String, required: true, 
                                match: emailRegexp,
                                index: true,
                                unique: true
                               },
  phone_number:                {type: String, required: true},
  braintree_customer_id:       {type: String, required: true}  
});



var Password = new mongoose.Schema({
  email_address: {
    type: String,
    index: true,
    unique: true,
    match: emailRegexp},
  salt:             String,
  hash:             String
});



var Order = new mongoose.Schema({
  
  gig_id:                {type: String,  default: 'default_gig_id'},
  user_id:               {type: String,  default: 'default_user_id'},
  user_authenticated:    {type: Boolean, default: false},
  number_of_tickets:     {type: Number,  default: 0},
  ticket_price:          {type: Number,  default: 0},
  transaction_amount:    {type: Number,  default: 0},
  transaction_id:        {type: String,  default: 'default_transaction_id'},
  transaction_status:    {type: String,  default: 'default_transaction_status'},
  braintree_customer_id: {type: String,  default: 'default_braintree_customer_id'},

  main_event:            {type: String, default: 'default_main_event'},
  event_date:            {type: Date,   default: new Date('25 12 3000, 20:00')},
  opening_time:          {type: String, default: '8:00 pm'},
  venue:                 {type: String, default: 'default_venue'},
  age_group:             {type: String, default: 'default_age_group'},

  first_name:            {type: String, required: true},
  last_name:             {type: String, required: true},
});


var BetaUser = new mongoose.Schema({
  username:                   {type: String, required: true},
  password:                   {type: String, required: true},
});


//create the express application. express() returns a Function designed to 
//be passed to nodes http/https servers as a callback to handle requests. 
var app = express();




//CONFIGURE SERVER:
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express_validator());
  app.use(express.methodOverride());
  app.use(express.query());
  app.use(express.cookieParser('my secret string'));
  app.use(express.session({ 
    //store: new RedisStore,
    store: redis_store,
    secret: 'andre session secret', 
    cookie: {maxAge: 24 * 60 * 60 * 1000}
  }));
  app.use(app.router);


  //express will use the first static path to foler it encounters. so when site_prod 
  //app.use call is uncommented it will use that & ignore site_dev static folder even 
  //when it is uncommented also (!)
  //uncomment this to use production, optimized, code from r.js process
  app.use(express.static(path.join(application_root, 'site_prod')));

  //this sets the app to serve development code which is _not_ optimized 
  //app.use(express.static(path.join(application_root, 'site_dev')));

  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

//URL ROUTING:
//Groups of related routes are housed in their own files.
//And exposed using the module.exports 
// = function (mongoose, shackleton_conn, app, ... ) {...} practice.



// At the top, with other redirect methods before other routes 
// this redirects urls to the https version of the site
app.get('*', function (req, res, next){

  if(req.headers['x-forwarded-proto']!='https' && process.env.NODE_ENV === 'production') {
    console.log('in GET * , in x-forwarded-proto and NODE_ENV is production');
    res.redirect('https://tiklet.me' + req.url);
  }
  else {
    console.log('in GET * , calling next() middleware...');
    next() /* Continue to other routes if we're not redirecting */
  }

});


//this route gets called when a user emails admin@tiklet.me
//mandrill POSTS the email to this url & then we handle what to do with it
app.post('/api/admin_emails', function (req, res) {
  console.log('in POST /api/admin_emails and body posted is:');
  //console.log(req.body);

  email_services.send_email_onto_another_address('doctor cobweb', 
    'andre@spinninghalf.com.au', req.body);
  
  res.send(req.body);

  return;
});

//gig guide routes are in a different file, 'gig-guide-routes.js'
require('./server-routes/gig-guide-routes')(mongoose, shackleton_conn, app, Gig);


//users routes are in a different file, 'users-routes.js'
require('./server-routes/users-routes')(mongoose, shackleton_conn, app, User, Password,
                                        BetaUser);

//order routes are in a different file, 'orders-routes.js'
require('./server-routes/orders-routes')(mongoose, shackleton_conn, app, Order, Gig, User);

//a crude way of implementing the mobile pass route for iphone users
//app.get('/api/electronic_tickets/pkpass/:gig_id', pass.generate_pass(gig_id));
//require('./server-routes/pkpass')(mongoose, shackleton_conn, app);
require('./server-routes/mobile_tickets')(mongoose, shackleton_conn, app);

/*
//a crude way of implementing the mobile pass route for android users
app.get('/api/electronic_tickets/google_wallet', function (req, res) {
 return res.end('in GET /api/electronic_tickets/google_wallet. not implemented yet!!!');
});
*/



if (process.env.NODE_ENV === 'production') {
  //Heroku: start production server. ssl endpoint is used for https so use standard
  //http server

  app.listen(port, function () {
   console.log('HTTP Express server listening on port %d in %s mode', 
     port, app.settings.env);
  });

} else {
  //enable https server when in development mode i.e. on localhost.

  //SSL CERTIFICATE and PRIVATE KEY
  //RapidSSL private key and cert needed for making a https server
  var options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
  };

  //CREATE HTTPS SERVER:
  //this creates a https server listening on port 5000 and
  //uses a self generated certificate resulting in browsers
  //warning that the https://localhost:5000 is insecure.
  //fix this by getting a certificate signed by a real CA!
  //
  //note: app is a our Express application, a Function, and is
  //passed into node's https.createServer() as a callback handler for 
  //requests. cool.
  https.createServer(options, app).listen(port, function () {
    console.log('HTTPS Express server listening on port %d in %s mode', 
      port, app.settings.env);
  });
}
