/*
 * ORDERS ROUTES FILE 
 * - take a user, gig and make an order
 *
 */

var braintree = require('braintree');
var logged_in_required = require('./middleware/logged_in_required');
var restrict_user_to_self = require('./middleware/restrict_user_to_self');
var email_services = require('../services/email_services');
var PDFKit = require('pdfkit');
var fs = require('fs');
var QRCode = require('qrcode');
var gateway;


// OLD way of accessing the private key. 
// if you use foreman to start the app u can put the key in .env then reference it via
// process.env.BRAINTREE_PRIVATE_KEY

/*
//read in the braintree private key and fill out the rest of the details needed to
//connect to their gateway. 
fs.readFile('./braintree_private.key', function (err, data) {
  if (err) throw err;
  
  console.log('braintree_private.key contains: ' + data);
  console.log('typeof(data): ' + typeof(data));

  braintree_private_key = data.toString();

  console.log('typeof(braintree_private_key): ' + typeof(braintree_private_key));
 
  //strip off the trailin \n character
  braintree_private_key = braintree_private_key
                            .substring(0, braintree_private_key.length - 1);

  console.log('braintree_private_key after substring op: ' + braintree_private_key);

  var bt_details = {};
  bt_details.environment = braintree.Environment.Sandbox;
  bt_details.merchantId = "4wggvwzj9rjfjsm6";
  bt_details.publicKey =  "n6cxpx3q85yj4pqh";
  bt_details.privateKey = braintree_private_key;
  
  console.log(bt_details);

  gateway = braintree.connect(bt_details);

});
*/


gateway = braintree.connect({
  environment: braintree.Environment.Sandbox, 
  merchantId:  "4wggvwzj9rjfjsm6",
  publicKey:   "n6cxpx3q85yj4pqh",
  privateKey:  process.env.BRAINTREE_PRIVATE_KEY
});



//____________________________ROUTES (in this order in the file)____________________
//
// key x = commented out handler. staging to see if it is needed or not.
//
//___METHOD____ROUTE_____________________________________MIDDLEWARE_________________
//
//   GET       '/api/get_cookies'     
//   POST      '/api/orders/                            logged_in_required
//   PUT       '/api/orders/:id'                        logged_in_required
//   POST      '/api/orders/beforeunload_event_called'
//   POST      '/api/orders/give_up_reserved_tickets'
//   GET       '/api/orders/'                           logged_in_required



module.exports = function (mongoose, shackleton_conn, app, Order, Gig, User) {


  //models
  var OrderModel = shackleton_conn.model('Order', Order);
  var GigModel = shackleton_conn.model('Gig', Gig);
  var UserModel = shackleton_conn.model('User', User);
  


  //######  ROUTE HANDLER ######################################################

  app.get('/api/get_cookies/', function (req, res) {
    console.log('in GET /api/get_cookies');
    console.log('req.cookies: ')
    console.log(req.cookies);
    console.log('req.signedCookies: ')
    console.log(req.signedCookies);

    return res.send(req.cookies);
  }); //end GET /api/get_cookies/




  //######  ROUTE HANDLER ######################################################

  app.post('/api/orders/', logged_in_required, function (req, res) {
    console.log('*************** CREATING ORDER *************');
    console.log('POST /api/orders/ handler... Creating the order.');
    console.log(req.body);
    console.log('typeof(req.body.number_of_tickets: ' +
                 typeof(req.body.number_of_tickets));
    console.log('typeof(req.body.ticket_price: ' +
                 typeof(req.body.ticket_price));
    console.log('typeof(req.body.transaction_amount: ' +
                 typeof(req.body.transaction_amount));
    console.log('typeof(req.body.event_date: ' +
                 typeof(req.body.event_date));
    

    //TODO
    //sanitized the input

    req.checkBody('cc_number', 'Empty cc_number').notEmpty();
    req.checkBody('cc_cvv', 'Empty cc_cvv').notEmpty();
    req.checkBody('cc_month','Empty cc_month').notEmpty();
    req.checkBody('cc_year','Empty cc_year').notEmpty();
    req.checkBody('gig_id','Empty gig_id').notEmpty();
    req.checkBody('user_id','Empty user_id').notEmpty();
    req.checkBody('braintree_customer_id','Empty braintree_customer_id').notEmpty();
    req.checkBody('user_authenticated','Empty user_authenticated').notEmpty();
    req.checkBody('number_of_tickets','number_of_tickets').notEmpty();
    req.checkBody('number_of_tickets','number_of_tickets must be numeric').isNumeric();
    req.checkBody('number_of_tickets','number_of_tickets min is 1').min(1);
    req.checkBody('number_of_tickets','number_of_tickets max is 8').max(8);
    req.checkBody('ticket_price', 'Empty ticket_price').notEmpty();
    req.checkBody('ticket_price', 'ticket_price must be numberic').isNumeric();
    req.checkBody('transaction_amount','Empty transaction_amount').notEmpty();
    req.checkBody('transaction_amount','transaction_amount must be numeric').isNumeric();
    req.checkBody('transaction_id','Empty transaction_id').notEmpty();
    req.checkBody('transaction_status','Empty transaction_status').notEmpty();
    req.checkBody('main_event','Empty main_event').notEmpty();

    req.checkBody('event_date','Empty event_date').notEmpty();
    //add in date checking??

    req.checkBody('venue','Empty venue').notEmpty();
    req.checkBody('opening_time','Empty opening_time').notEmpty();
    req.checkBody('age_group','Empty age_group').notEmpty();
    req.checkBody('first_name','Empty first_name').notEmpty();
    req.checkBody('last_name','Empty last_name').notEmpty();
    req.checkBody('ticket_price', 'ticket_price must be numberic').isNumeric();


    req.sanitize('cc_number').xss();
    req.sanitize('cc_cvv').xss();
    req.sanitize('cc_month').xss();
    req.sanitize('cc_year').xss();
    req.sanitize('gig_id').xss();
    req.sanitize('user_id').xss();
    req.sanitize('braintree_customer_id').xss();
    req.sanitize('user_authenticated').xss();
    req.sanitize('number_of_tickets').xss();
    req.sanitize('ticket_price').xss();
    req.sanitize('transaction_amount').xss();
    req.sanitize('transaction_id').xss();
    req.sanitize('transaction_status').xss();
    req.sanitize('main_event').xss();
    req.sanitize('event_date').xss();
    req.sanitize('venue').xss();
    req.sanitize('opening_time').xss();
    req.sanitize('age_group').xss();
    req.sanitize('first_name').xss();
    req.sanitize('last_name').xss();


    //errors is an Array of Objects. One obj for each validation check
    var _validation_errors = req.validationErrors();

    if (_validation_errors) {
      console.log('VALIDATION_ERROR: in POST /api/orders/ :');
      console.log(_validation_errors);
      return res.send({'errors': {validation_errors: _validation_errors,
                                  internal_errors: {}
                                 },
                        success: false
                      });
    }


    //start the order creation process
    initial_order_saved_from_clientside(req, res, function (err) {
      if (err) {
        console.log('INTERNAL_ERROR: in POST /api/orders/ : ' + err);
        return res.send({'errors': {validation_errors: [],
                                    internal_errors: err
                                   }, 
                         success: false});
      }
    });
  }); //end POST /api/orders/


  //NEED TO CHECK IF CAPACITY OF GIG CAN HANDLE THE NUMBER OF TICKETS REQUESTD
  function initial_order_saved_from_clientside (req, res, callback) {
    console.log('=> initial_order_save_from_clientside');

    //some vars go here
    var the_gig;
    var the_user;
    var the_order;


    //STEPS 
    function find_the_gig() {
      console.log('=> initial_order_save_from_clientside => find_the_gig');
      GigModel.findById(req.body.gig_id, the_found_gig);
    }


    function the_found_gig(err, gig) {
      console.log('=> initial_order_save_from_clientside => the_found_gig');

      if (err) {
        return callback(err);
      }
      if (!gig) {
        return callback({'error': 'gig_is_null'});
      }
      the_gig = gig;

      console.log('GIG PRE-RESERVATION (no tickets deducted from capacity yet): ' + 
                  + 'gig.capacity = ' + the_gig.capacity);
      //console.log(gig);

      var delta_tickets = the_gig.capacity - parseInt(req.body.number_of_tickets, 10);

      if (the_gig.capacity === 0) {
        //gig is sold out even BEFORE we have tried to deduct tix

        //sold out 
        console.log('gig is SOLD OUT: gig._id: ' + the_gig._id);
        return callback({'error': 'gig_has_sold_out'});
        //return res.send({'error': 'gig_has_sold_out'});

      } else if ( delta_tickets < 0) {

        //no enough tickets available to meet the users demand
        console.log('gig cannot supply number of demanded tix: gig._id: ' 
                      + the_gig._id
                      + ' delta_tickets: ' + delta_tickets);

        return callback({'error': 'not_enough_tickets_left'});

      } else {
        //there ARE enough tickets available, go on
        console.log('there ARE enough tickets for the gig: ' + the_gig._id);
        find_the_user();
      }

    }
 

    function find_the_user() {
      console.log('=> initial_order_save_from_clientside => find_the_user');
      UserModel.findById(req.session.user_id, the_found_user);
    }


    function the_found_user(err, user) {
      console.log('=> initial_order_save_from_clientside => the_found_user');
      if (err) { 
        return callback(err);
      } 
      if (!user) {
        return callback({'error':'user_is_null'});
      }
      the_user = user;
      create_the_order();
    }
   

    function create_the_order() {
      console.log('=> initial_order_save_from_clientside => create_the_order');

      //calculate the total $ to charge
      var the_total_amount = req.body.number_of_tickets * the_gig.price;

      the_order = new OrderModel({
        user_authenticated: true,
        user_id: the_user._id,
        gig_id: the_gig._id,
        main_event: the_gig.main_event,
        event_date: the_gig.event_date,
        opening_time: the_gig.opening_time,
        venue: the_gig.venue,
        age_group: the_gig.age_group,
        first_name: the_user.first_name,
        last_name: the_user.last_name,
        ticket_price: the_gig.price,
        number_of_tickets: req.body.number_of_tickets,
        transaction_amount: the_total_amount,
        braintree_customer_id: the_user.braintree_customer_id
      });
     

      the_order.save(function (err, order) {
        if (err) {
          return callback(err);
        }

        //set the order variable to the saved order      
        the_order = order;

        //****** SET THE reserve_tickets cookie *******

        //TODO: flesh this cookie ticket reservation process out more.
        //set a cookie with a timeout corresponding to how long the tix are reserved
        //had to get rid of the httpOnly flag in order to use clientside setInterval
        //function to see if the reserve_tickets cookie exists.
        //nb: httpOnly:true will not let the client site app poll the cookie. 
        //=> no ticket reservation is available given the current implementation
        //e.g. {maxAge: 60 * 1000, httpOnly: true, signed: true} will NOT WORK
        res.cookie(
          'reserve_tickets', {
            'number_of_tickets': req.body.number_of_tickets.toString(10),
            'gig_id': req.body.gig_id,
            'order_id': order._id
          }, 
          //{maxAge: 1 * 60 * 1000, signed: true, secure: true} //reserve tix for 1mins
          //{maxAge: 15 * 60 * 1000, signed: true, secure: true} //reserve tix for 15mins
          //{maxAge: 30 * 1000, signed: true, secure: true} //reserve tix for 30s
          {maxAge: 20 * 1000, signed: true, secure: true} //reserve tix for 20s
        );

        //before returning the order you must make sure the gig capacity is successfully
        //updated.
        deduct_the_tickets_reserved_from_capacity();
      });
    }


    function deduct_the_tickets_reserved_from_capacity() {

      the_gig.capacity = the_gig.capacity - req.body.number_of_tickets;

      the_gig.save(function (err, gig) {
        if (err) {
          return callback(err);
        }
        console.log('GIG POST-RESERVATION ' +  
                    '(should have reserved tix subtracted from capacity: ' + 
                    'gig.capacity = ' + gig.capacity);



        //finally return the order
        //return res.send({'errors': { validation_errors: [],
        //                             internal_errors: {}
        //                           }, 
        //                 'order': order, 
        //                  success: true
        //                });

        //Backbone does not like api returning a custom object because it expects an _id
        //parameter 1-level deep (i think). out custom object has the _id 2 levels deep
        //return res.send(order);
        return res.send(the_order);
      });
    }

    //START the sequence of function calls
    find_the_gig();
  }





  //######  ROUTE HANDLER ######################################################

  //TODO: validate, sanitize, error handling
  //UPDATE THE ORDER
  app.put('/api/orders/:id', logged_in_required, function (req, res) {
    console.log('in PUT /api/orders/:id handler');
    console.log(req.body);
    console.log('id param in url: ' + req.params.id);


    //sanitized the input
    req.checkBody('cc_number', 'Empty cc_number').notEmpty();
    req.checkBody('cc_cvv', 'Empty cc_cvv').notEmpty();
    req.checkBody('cc_month','Empty cc_month').notEmpty();
    req.checkBody('cc_year','Empty cc_year').notEmpty();
    req.checkBody('gig_id','Empty gig_id').notEmpty();
    req.checkBody('user_id','Empty user_id').notEmpty();
    req.checkBody('braintree_customer_id','Empty braintree_customer_id').notEmpty();
    req.checkBody('user_authenticated','Empty user_authenticated').notEmpty();
    req.checkBody('number_of_tickets','number_of_tickets').notEmpty();
    req.checkBody('number_of_tickets','number_of_tickets must be numeric').isNumeric();
    req.checkBody('number_of_tickets','number_of_tickets min is 1').min(1);
    req.checkBody('number_of_tickets','number_of_tickets max is 8').max(8);
    req.checkBody('ticket_price', 'Empty ticket_price').notEmpty();
    req.checkBody('ticket_price', 'ticket_price must be numberic').isNumeric();
    req.checkBody('transaction_amount','Empty transaction_amount').notEmpty();
    req.checkBody('transaction_amount','transaction_amount must be numeric').isNumeric();
    req.checkBody('transaction_id','Empty transaction_id').notEmpty();
    req.checkBody('transaction_status','Empty transaction_status').notEmpty();
    req.checkBody('main_event','Empty main_event').notEmpty();

    req.checkBody('event_date','Empty event_date').notEmpty();
    //add in date checking??

    req.checkBody('venue','Empty venue').notEmpty();
    req.checkBody('opening_time','Empty opening_time').notEmpty();
    req.checkBody('age_group','Empty age_group').notEmpty();
    req.checkBody('first_name','Empty first_name').notEmpty();
    req.checkBody('last_name','Empty last_name').notEmpty();
    req.checkBody('ticket_price', 'ticket_price must be numberic').isNumeric();


    req.sanitize('cc_number').xss();
    req.sanitize('cc_cvv').xss();
    req.sanitize('cc_month').xss();
    req.sanitize('cc_year').xss();
    req.sanitize('gig_id').xss();
    req.sanitize('user_id').xss();
    req.sanitize('braintree_customer_id').xss();
    req.sanitize('user_authenticated').xss();
    req.sanitize('number_of_tickets').xss();
    req.sanitize('ticket_price').xss();
    req.sanitize('transaction_amount').xss();
    req.sanitize('transaction_id').xss();
    req.sanitize('transaction_status').xss();
    req.sanitize('main_event').xss();
    req.sanitize('event_date').xss();
    req.sanitize('venue').xss();
    req.sanitize('opening_time').xss();
    req.sanitize('age_group').xss();
    req.sanitize('first_name').xss();
    req.sanitize('last_name').xss();


    //errors is an Array of Objects. One obj for each validation check
    var _validation_errors = req.validationErrors();

    if (_validation_errors) {
      console.log('VALIDATION_ERROR: in PUT /api/orders/ :');
      console.log(_validation_errors);
      return res.send({'errors': {validation_errors: _validation_errors,
                                  internal_errors: {}
                                 },
                        success: false
                      });
    }


    //start the order creation process
    update_the_order(req, res, function (err) {
      if (err) {
        console.log('INTERNAL_ERROR: in PUT /api/orders/ : ' + err);
        return res.send({'errors': {validation_errors: [],
                                    internal_errors: err
                                   }, 
                         success: false});
      }
    });


  }); //end PUT /api/orders/:id


  //TODO: check order_id matches that of the one in cookie

  function update_the_order(req, res, callback) {
    console.log('=> update_the_order');
  
    var the_user;
    var the_gig;
    var the_order;


    function find_the_order_and_gig() {
      console.log('=> update_the_order => find_the_order');

      OrderModel.findOne({'_id': req.params.id}, function (err, order) {
        if (err) {
          return callback(err);
        }
        if (!order) {
          return callback({'error': 'order_is_null'});
        }
        the_order = order;
        console.log('the_order: ' + the_order);


        //also find the gig document pertaining to this order.
        //need it for later when we make the pdf tiket
        GigModel.findById(order.gig_id, function (err, gig) {
          if (err) {
            return callback(err);
          }
          the_gig = gig;
          find_the_user();
        });

      });
    }
 

    function find_the_user() {
      console.log('=> update_the_order => find_the_user');

      UserModel.findOne({'_id': req.body.user_id}, function (err, user) {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback({'error': 'user_is_null'});
        }
        console.log('the_user:' + the_user);

        the_user = user;
        start_transaction();
      });
    }


    function start_transaction() {
      console.log('=> update_the_order => start_transaction');

      //AUTHORIZE the card
      gateway.transaction.sale({
          customerId: the_user.braintree_customer_id,
          amount: the_order.transaction_amount
        }, 
        function (err, result) {
          if (err) {
            return callback(err);
          }
          if (!result) {
            return callback({'error': 'result_is_null'});
          }

          //IMPORTANT: only proceed with sale if transaction status is 'authorized'
          if (result.success) {
            if (result.transaction.status === 'authorized') {
              console.log('gateway.transaction.sale returned in result object: ' +
                          'result.transaction.status: ' + result.transaction.status);

              submit_for_settlement(result.transaction.id);

            } else {

              //the braintree_customer_id is NOT authorized for use
              return callback({'error': 'braintree_customer_id_is_not_authorized'});
            }
          } else {
            handle_transaction_error(result);
          }
        }
      );
    }


    function submit_for_settlement(transaction_id) {
      console.log('=> update_the_order => submit_for_settlement');

        gateway.transaction.submitForSettlement(transaction_id,
          function (err, result) {
            if (err) {
              return callback(err);
            }
            if (!result) {
              return callback({'error':'result_is_null'});
            }
            if (result.success) {
              //successful transaction

              console.log('SUCCESS: gateway.transaction.sale successful.'
                            + 'result.transaction.status: ' + result.transaction.status);
              console.log(result);

              the_order.braintree_customer_id = the_user.braintree_customer_id;
              the_order.transaction_status = result.transaction.status;
              the_order.transaction_id = result.transaction.id;

              save_the_user_changes();

            } else {
              //check for validation errors etc
              handle_transaction_error(result);

            }
          }
        );
    }



    function save_the_user_changes() {
      console.log('=> update_the_order => save_the_user_changes');

      the_user.save(function(err) {
        if (err) {
          return callback(err);
        }
        console.log('... user updates saved');

        save_the_order_changes()
      });
    }



    function save_the_order_changes() {
      console.log('=> update_the_order => save_the_order_changes');

      the_order.save(function (err, saved_order) {
        if (err) {
          return callback(err);
        }
        if (!saved_order) {
          return callback({'error':'saved_order_is_null'});
        } 
        console.log('...order updates saved');

        //make browser delete the cookie
        //NB. if you dont delete the cookie after a succssful purchase & user tries
        //to buy another gig, the purchased tickets number will be added back to the
        //gig capacity. resulting in a successful monetery transaction but the gig
        //capacity will show NO CHANGE!!!
        res.clearCookie('reserve_tickets', { signed: true, secure: true});
        
        //SUCCESSFUL ORDER PURCHASE. 
        // *** IMPORTANT *** : this is the response to say order is SUCCESSFUL
        res.send(saved_order);

        create_the_eticket();       
      }); //end order.save()
    }


    function create_the_eticket() {

      //send the the user an email containing the ticket in pdf format
      console.log('creating the eTix...');
      console.log('typeof(the_order._id): ' + typeof(the_order._id));
      //try to change _id to a string
      _id_string = the_order._id.toString();
      console.log('typeof(_id_string): ' + typeof(_id_string));
      console.log('_id_string: ' + _id_string); 
      console.log('typeof(number_of_tickets): ' + typeof(the_order.number_of_tickets));
     


      // the '/////' used in the string is for parsing the fields when the qrcode is
      //scanned 
      var info_in_qrcode = the_order._id.toString() +
                           '/////' +
                           the_order.first_name +
                           '/////' +
                           the_order.last_name +
                           '/////' +
                           the_order.main_event +
                           '/////' +
                           the_order.number_of_tickets.toString(10) +
                           '/////' +
                           the_order.transaction_status;

      console.log('info_in_qrcode: ' + info_in_qrcode);

   
      QRCode.toDataURL(info_in_qrcode, function(err,url){
          console.log('in QRCODE.toURL call, url: ');
          console.log(typeof(url));
     
          //strip away the 'data:image/png;base64,' part from url
          var comma_index = url.indexOf(',');
          console.log(comma_index); //21
     
          url = url.substring(22);
     
          //console.log('the base64 encoded value in QRCODE: ' + url);
     
          var b = new Buffer(url, 'base64');
          fs.writeFileSync('first_qr_code.png', b);



          //DEMO: create a pdf document using pdfkit module
          var doc = new PDFKit();
  
          doc.info['Author'] = 'Tiklet.me';
          doc.info['Title'] = 'your Tikle.me tiket';
          doc.fontSize(12)
             .font('Courier-Bold')
             .lineWidth(25)
   
             .strokeColor('black')
             .moveTo(150, 100)
             .lineTo(100,150)
             .lineTo(150, 200)
             .stroke()
   
             .strokeColor('orange')
             .moveTo(200, 100)
             .lineTo(200, 200)
             .moveTo(250, 100)
             .lineTo(250, 200)
             .stroke()
   
             .strokeColor('black')
             .moveTo(300, 100)
             .lineTo(350, 150)
             .lineTo(300, 200)
             .stroke()
  
  
             .moveDown(15)
             .text('hello ' + the_user.first_name + ',')
             .text('this is your tiket to the show.')
             .text('please keep it safe.')
             .moveDown()
             .moveDown()
             .text('__DETAILS__')
             .text('EVENT: ' + the_order.main_event)
             .text('DATE: ' + the_order.event_date)
             .text('OPENING_TIME: ' + the_order.opening_time)
             .text('VENUE: ' + the_order.venue)
             .text('AGE_GROUP: ' + the_order.age_group)
             .text('FIRST_NAME: ' + the_order.first_name)
             .text('LAST_NAME: ' + the_order.last_name)
             .text('NUMBER_OF_TIKETS: ' + the_order.number_of_tickets)
             .moveDown()
             .moveDown()
             .text('__DEBUGGING__')
             .text('ORDER_ID: ' + the_order._id.toString())
             .text('TRANSACTION_STATUS: ' + the_order.transaction_status)


             .image('./first_qr_code.png', 50, 500 ) //relative to server.js location!

             .output(function (result) {
               console.log('typeof(result): ' + typeof(result));
               //console.log(result);
   
               email_services.send_ticket_purchase_email(
                 the_user.first_name,
                 the_user.email_address,
                 result);
             });
     }); //end QRCode.toDataURL
    }



    function handle_transaction_error(result) {
      console.log('=> update_the_order => handle_transaction_error');
      console.log(result);
      console.log('ERROR: braintree: result.message' + result.message);

      return callback({'error': result.message});
    }



    //START the sequence of function calls
    find_the_order_and_gig();
  }



  
  //######  ROUTE HANDLER ######################################################

  //TODO: implement the release better. error handling...
  //called when user navigates away, closes tab, closes window. tries to clean up any
  //reserved orders.

  app.post('/api/orders/beforeunload_event_called', function (req, res) {
    console.log('**************  POST /api/orders/beforeunload_event called');
    console.log(req.body);

    req.checkBody('reserved_order_id','Empty reserved_order_id').notEmpty();
    req.sanitize('reserved_order_id').xss();

    //errors is an Array of Objects. One obj for each validation check
    var _validation_errors = req.validationErrors();

    if (_validation_errors) {
      console.log('VALIDATION_ERROR: in POST /api/orders/beforeunload_event_called:');
      console.log(_validation_errors);
      return res.send({'errors': {validation_errors: _validation_errors,
                                  internal_errors: {}
                                 },
                        success: false
                      });
    }


    //there is a reserved order, release it
    console.log('there IS a reserved order,POST /api/orders/beforeunload_event_called');

    give_up_reserved_tickets(req, res, function (err) {
      if (err) {
        console.log('INTERNAL_ERROR: in POST /api/orders/beforeunload_event_called : ' 
                    + err);
        return res.send({'errors': {validation_errors: [],
                                    internal_errors: err
                                   }, 
                         success: false});
      }
    }); 

  }); //end POST /api/orders/beforeunload_event_called





  //######  ROUTE HANDLER ######################################################

  app.post('/api/orders/give_up_reserved_tickets', function (req, res) {
    console.log(' in POST /api/orders/give_up_reserved_tickets handler. req.body: ');
    console.log(req.body);

    console.log('req.signedCookies');
    console.log(req.signedCookies);
    console.log('req.signedCookies.reserve_tickets: ');
    console.log(req.signedCookies.reserve_tickets);



    req.checkBody('the_cookie','Empty cookie').notEmpty();
    req.checkBody('reserved_order_id','Empty reserved_order_id').notEmpty();
    req.sanitize('the_cookie').xss();
    req.sanitize('reserved_order_id').xss();

    //errors is an Array of Objects. One obj for each validation check
    var _validation_errors = req.validationErrors();

    if (_validation_errors) {
      console.log('VALIDATION_ERROR: in POST /api/orders/beforeunload_event_called:');
      console.log(_validation_errors);
      return res.send({'errors': {validation_errors: _validation_errors,
                                  internal_errors: {}
                                 },
                        success: false
                      });
    }


    give_up_reserved_tickets(req, res, function (err) {
      if (err) {
        console.log('INTERNAL_ERROR: in POST /api/orders/give_up_reserved_tickets : ' 
                    + err);
        return res.send({'errors': {validation_errors: [],
                                    internal_errors: err
                                   }, 
                         success: false});
      }

    });

  }); //end POST /api/orders/give_up_reserved_tickets



  function give_up_reserved_tickets(req, res, callback) {
    var the_order;
    var the_gig;
    
    console.log('reserved_order_id: ' + req.body.reserved_order_id);


    function find_the_order() {
      console.log('=> give_up_reserved_tickets => find_the_order');
      OrderModel.findById(req.body.reserved_order_id, the_found_order);
    }


    function the_found_order(err, order) {
      console.log('=> give_up_reserved_tickets => the_found_order');
      console.log(order);
      if (err) { 
        return callback(err);
      } 
      if (!order) {
        return callback({'error':'order_is_null'});
      }
      the_order = order;
      find_the_gig();
    }


    function find_the_gig() {
      console.log('=> give_up_reserved_tickets => find_the_gig');

      GigModel.findById(the_order.gig_id, the_found_gig);
    }


    function the_found_gig(err, gig) {
      console.log('=> give_up_reserved_tickets => the_found_gig');
      if (err) {
        return callback(err);
      }
      if (!gig) {
        return callback({'error': 'gig_is_null'});
      }
      the_gig = gig;
      do_the_updating();
    }


    function do_the_updating() {
      //update the gig capacity
      //update the order collection -> delete the past order
      //delete the reserve_tickets cookie

      console.log('=> give_up_reserved_tickets => do_the_updating');
      the_gig.capacity += parseInt(the_order.number_of_tickets);

      the_gig.save(function (err, gig) {
        if (err) {
          return callback(err);
        }
        console.log('the gig capacity has been successfully altered: ');
        console.log('gig');
        console.log(gig);
      });


      //now delete the order
      the_order.remove(function (err) {
        if (err) {
          return callback(err);
        }
        console.log('the order has been successfully deleted');
      });

      //make browser delete the cookie
      res.clearCookie('reserve_tickets', { signed: true, secure: true});

      //finally return the outcome
      //return res.send({'SUCCESS': 'gave up reserved tickets'});
      return res.send({'errors': {validation_errors: [],
                                  internal_errors: {} 
                                 }, 
                       success: true});
    }


    //start the process off 
    find_the_order();
  }
 


  //######  ROUTE HANDLER ######################################################

  //GET THE ORDERS FOR A USER
  app.get('/api/orders/', 
    logged_in_required, 
    function (req, res) {
      console.log('getting all the orders for a given user.');
      console.log('in GET /api/orders/');

      return OrderModel.find({
        user_id: req.session.user_id}, 
        function (err, orders) {
          if (err) {
            //return res.send(err);
            return res.send({'errors': {validation_errors: [],
                                        internal_errors: err 
                                       }, 
                             success: false});
          }
          console.log('FOUND ORDERS FOR USER: ' + req.session.user_id);
          console.log(orders);
          return res.send(orders);
        }
      );
  }); //end GET /api/orders/




}; //end module.exports
