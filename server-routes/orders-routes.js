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

module.exports = function (mongoose, shackleton_conn, app, Order, Gig, User) {

  //models
  var OrderModel = shackleton_conn.model('Order', Order);
  var GigModel = shackleton_conn.model('Gig', Gig);
  var UserModel = shackleton_conn.model('User', User);
 
  

  //######  ROUTE HANDLER ######################################################

  app.post('/api/orders/', function (req, res) {
    console.log('POST /api/orders/ handler... Creating the order.');

    //TODO: flesh this cookie ticket reservation process out more.
    //set a cookie with a timeout corresponding to how long the tix are reserved
    //had to get rid of the httpOnly flag in order to use clientside setInterval
    //function to see if the reserve_tickets cookie exists. there must be a better way.
    res.cookie(
      'reserve_tickets', 
      req.body.number_of_tickets.toString(10),

      //nb: httpOnly:true will not let the client site app poll the cookie. 
      //=> no ticket reservation is available given the current implementation
      //e.g. {maxAge: 60 * 1000, httpOnly: true, signed: true} will NOT WORK

      {maxAge: 15 * 60 * 1000, signed: true} //reserve tix for 15mins
      //{maxAge: 10 * 1000, signed: true} //reserve tix for 10s

    );


    //TESTING/MUCKING AROUND WITH COOKIES
    /*
    //test cookies
    res.cookie(
      'test_cookie_1', 
      '1',
      {maxAge: 3 * 60 * 1000, signed: true}
      //{maxAge: 3 * 60 * 1000, httpOnly: true, signed: true}
    );

    res.cookie(
      'test_cookie_2', 
      '2',
      {maxAge: 3 * 60 * 1000, signed: true}
      //{maxAge: 3 * 60 * 1000, httpOnly: true, signed: true}
    );
    */


    //start the order creation process
    initial_order_saved_from_clientside(req, res, function (err) {
      if (err) {
        throw err;
      }
    });



  });

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
        return res.send({'error': 'gig_is_null'});
      }

      the_gig = gig;
      console.log('GIG PRE-RESERVATION: ');
      console.log(gig);
      var delta_tickets = the_gig.capacity - parseInt(req.body.number_of_tickets);

      if (the_gig.capacity === 0) {

        //sold out 
        console.log('gig is SOLD OUT: gig._id: ' + the_gig._id);
        return res.send({'error': 'gig_has_sold_out'});

      } else if ( delta_tickets < 0) {

        //no enough tickets available to meet the users demand
        console.log('gig cannot supply number of demanded tix: gig._id: ' 
                      + the_gig._id
                      + ' delta_tickets: ' + delta_tickets);

        return res.send({'error': 'not_enough_tickets_left', 
                         amount_left:delta_tickets});

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
        return res.send({'error':'user_is_null'});
      }
      the_user = user;
      create_the_order();
    }
   
    function create_the_order() {
      console.log('=> initial_order_save_from_clientside => create_the_order');
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
     
      deduct_the_tickets_reserved_from_capacity();

      the_order.save(function (err, order) {
        if (err) {
          return callback(err);
        }
        //console.log(order);
        return res.send(order);
      });
    }

    function deduct_the_tickets_reserved_from_capacity() {
      the_gig.capacity -= req.body.number_of_tickets;

      the_gig.save(function (err, gig) {
        if (err) {
          return callback(err);
        }
        console.log('GIG POST-RESERVATION: ');
        console.log(gig);
      });
      
    }


    //START the sequence of function calls
    find_the_gig();
  }



  //######  ROUTE HANDLER ######################################################

  //UPDATE THE ORDER
  app.put('/api/orders/:id', function (req, res) {
    console.log('in PUT /api/orders/:id handler');
    console.log('id param in url: ' + req.params.id);

    update_the_order(req, res, function (err) {
      if (err) {
        console.log(JSON.stringify(err));
        throw err;
      } 
    });

  });


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
          return res.send({'error': 'order_is_null'});
        }
        the_order = order;
        console.log('the_order: ' + the_order);

        find_the_user();

        //also find the gig document pertaining to this order.
        //need it for later when we make the pdf tiket
        GigModel.findById(order.gig_id, function (err, gig) {
          if (err) {
            return callback(err);
          }
          the_gig = gig;
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
          return res.send({'error': 'user_is_null'});
        }
        the_user = user;
        console.log('the_user:' + the_user);
        start_braintree_procedure();
      });
    }

    function start_braintree_procedure() {
      console.log('=> update_the_order => start_braintree_procedure');

      //split checkout process into 2 parts based on whether user has a stored
      //braintree customer id or not
      if (the_user.braintree_customer_id === 'default_braintree_customer_id') {

        // *** IMPORTANT *** eventually get rid of this function chain...
        // i dont think this function chain is ever called. because the ui flow has
        //changed so only purchases are made after cc has been verified & hence there is
        //a braintree customer id present.
        //
        // for now then comment the call out & see if any bugs result. => still hav a
        // dependency on this function chain.
        //
        //STREAM 1: user_is_new_purchaser i.e. has _no_ braintree customer id 
        //user_is_new_purchaser();

      } else {

        //STREAM 2: user_is_returning_purchaser i.e. they have a braintree customer id
        user_is_returning_purchaser(); 

      } 
    }

    /*
    function user_is_new_purchaser() {
      console.log('=> update_the_order => user_is_new_purchaser');

      //create a new customer 
      var customer_request = {
        firstName: the_user.first_name,
        lastName: the_user.last_name,
        phone: the_user.phone_number,
        email: the_user.email_address,
        creditCard: {
          number: req.body.cc_number,
          cvv: req.body.cc_cvv,
          expirationMonth: req.body.cc_month,
          expirationYear: req.body.cc_year
        }
      };
     
      gateway.customer.create(customer_request, function (err, result) {
        console.log('in gateway.customer.create callback.'
                    + ' result obj: ');
        console.log(result);
        if (err) {
          return callback(err);
        }
        if (!result) {
          return res.send({'error': 'result_is_null'});
        }
        if (result.success) {
          console.log('SUCCESS: created a braintree customer. braintree_customer_id: '
                        + result.customer.id);
          console.log('result: ');
          console.log(result);

          submit_for_settlement({
            'method': 'submitted_cc_details',
            'braintree_customer_id': result.customer.id}); 

          the_user.braintree_customer_id = result.customer.id;
          the_order.braintree_customer_id = result.customer.id;

        } else {
          //braintree send back result.success = false
          return callback(result);
        }
      });

    }
    */

    function user_is_returning_purchaser() {
      console.log('=> update_the_order => user_is_returning_purchaser');

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
            return res.send({'error': 'result_is_null'});
          }

          //IMPORTANT: only proceed with sale if transaction status is 'authorized'
          if (result.success) {
            if (result.transaction.status === 'authorized') {
              console.log('gateway.transaction.sale returned in result object: ' +
                          'result.transaction.status: ' + result.transaction.status);

              //the braintree_customer_id is authorized for use
              submit_for_settlement({'method':'braintree_customer_id', 
                'transaction_id': result.transaction.id
              }); 

            } else {

              //the braintree_customer_id is NOT authorized for use
              return res.send({'error': 'braintree_customer_id_is_not_authorized'});
            }
          } else {
            handle_transaction_error(result);
          }
        }
      );
    }


    //options is an obj used to determine what to use for submitting for settlement 
    //options = {'method': 'submitted_cc_details' or 'braintree_customer_id'
    //           'transaction_id': pass in from authorizing an existing customer id
    //          }
    function submit_for_settlement(options) {
      console.log('=> update_the_order => submit_for_settlement');
     
      if (!options) {
        return callback({'internal_backend_error': 'failed_to_supply_options_object'});
      }


      /* 
      if (options.method === 'submitted_cc_details') {

        console.log('in submit_for_settlement, options.method '
                      + '=== \'submitted_cc_details\'');


        gateway.transaction.sale({
            customerId: options.braintree_customer_id,
            amount: the_order.transaction_amount,
            options: {
              submitForSettlement: true 
            } 
          },
          function (err, result) {
            if (err) return callback(err);
            if (!result) return res.send({'error': 'result_is_null'});
            if (!result.success) handle_transaction_error(result);

            console.log('SUCCESS: submitted for settlement. Result obj: ');
            console.log(result);

            the_order.transaction_status = result.transaction.status;
            the_order.transaction_id = result.transaction.id;

            save_the_order_changes();
            save_the_user_changes();

            return res.send(the_order);
          }
        );
      }
      */

       if (options.method === 'braintree_customer_id') {

        console.log('in submit_for_settlement, options.method ' 
                      + '=== \'braintree_customer_id\'');


        gateway.transaction.submitForSettlement(options.transaction_id,
          function (err, result) {
            if (err) {
              return callback(err);
            }
            if (!result) {
              return res.send({'error':'result_is_null'});
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

              save_the_order_changes();
              //return res.send(the_order);
            } else {
              handle_transaction_error(result);

            }
          }
        );
      } else {
        return callback({'internal_backend_error': 'options.method_value_unexpected'});
      }

    }



    function handle_transaction_error(result) {
      console.log('=> update_the_order => handle_transaction_error');
      console.log(result);
      console.log('ERROR: braintree: result.message' + result.message);

      //TODO: scroll through the different types of transaction failures

      return res.send(result.message);

    }

    function save_the_order_changes() {
      the_order.save(function (err, saved_order) {
        if (err) {
          return callback(err);
        }
        if (!saved_order) {
          return callback({'error':'saved_order_is_null'});
        } 
        console.log('order updates saved');
        
        //SUCCESSFUL ORDER PURCHASE. 
        // *** IMPORTANT *** : this is the response to say order is SUCCESSFUL
        res.send(saved_order);

        //refactor this stuff into another fuction, and the just call it from here.
        //now go onto creating the pdf ticket and send email
       
        //send the the user an email containing the ticket in pdf format


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

     
        QRCode.toDataURL(info_in_qrcode,function(err,url){
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
       });
      });
    }

    function save_the_user_changes() {
      the_user.save(function(err) {
        if (err) {
          return callback(err);
        }
        console.log('user updates saved');
      });
    }



    //START the sequence of function calls
    find_the_order_and_gig();
  }



  //######  ROUTE HANDLER ######################################################

  //called when reserved tickets have timed out => add back the reserved tix to general
  //pool
  app.post('/api/orders/ticket_reserve_timeout', function (req, res) {
    console.log('ATTEMPTING TO DELETE THE RESERVED TICKETS & ORDER...');
    console.log('in POST api/orders/ticket_reserve_timeout');
    console.log(req.body);

    expired_ticket_reserve(req, res, function (err) {
      if (err) throw err;
    });

  });


  function expired_ticket_reserve(req, res, callback) {
    var the_order;
    var the_gig;

    function find_the_gig() {
      console.log('=> expired_ticket_reserve => find_the_gig');
      GigModel.findById(req.body.gig_id, the_found_gig);
    }

    function the_found_gig(err, gig) {
      console.log('=> expired_ticket_reserve => the_found_gig');
      if (err) {
        return callback(err);
      }
      if (!gig) {
        return res.send({'error': 'gig_is_null'});
      }
      the_gig = gig;
      find_the_order();
    }

    function find_the_order() {
      console.log('=> expired_ticket_reserve => find_the_order');
      OrderModel.findById(req.body._id, the_found_order);
    }

    function the_found_order(err, order) {
      console.log('=> expired_ticket_reserve => the_found_order');
      if (err) { 
        return callback(err);
      } 
      if (!order) {
        return res.send({'error':'order_is_null'});
      }
      the_order = order;
      do_the_updating();
    }

    function do_the_updating() {
      console.log('=> expired_ticket_reserve => do_the_updating');
      the_gig.capacity += parseInt(req.body.number_of_tickets);
      //console.log('the_gig');
      //console.log(the_gig);

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

      return res.send({'OCCURRANCE': 'put ticket reserve back into the general pool.'});
    }


    //start the process off 
    find_the_gig();
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
            return res.send(err);
          }
          console.log('FOUND ORDERS FOR USER: ' + req.session.user_id);
          console.log(orders);
          return res.send(orders);
        }
      );
  });




}; //end module.exports
