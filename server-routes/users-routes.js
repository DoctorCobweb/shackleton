/*
 *
 * USERS ROUTES FILE
 * - user login/out, register, authentication/sessions, delete account
 *
 */


var braintree = require('braintree');
var format = require('util').format;
var bcrypt = require('bcrypt');
var email_services = require('../services/email_services');
var Pdfkit = require('pdfkit');
var fs = require('fs');

//custom middleware used for route middleware
var logged_in_required = require('./middleware/logged_in_required');
var not_logged_in_required = require('./middleware/not_logged_in_required');
var restrict_user_to_self= require('./middleware/restrict_user_to_self');

//default object values for a User. i.e. if they dont enter anything in a particular 
//form field it will 'auto-fill' with default values.
var user_defaults = {
  first_name:            'default_first_name',
  last_name:             'default_last_name',
  email_address:         'default_email_address',
  phone_number:          'default_phone_number',
  braintree_customer_id: 'default_braintree_customer_id'
};

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "4wggvwzj9rjfjsm6",
  publicKey: "n6cxpx3q85yj4pqh",
  privateKey: "d82482f85851a6f80bd02ef438a3d38f"
});



//____________________________ROUTES (in this order in the file)____________________
//
//
//
//___METHOD____ROUTE_____________________________________MIDDLEWARE_________________
//
//   GET       '/api/users'                              logged_in_required
//   GET       '/api/users/session'
//   GET       '/api/users/account/billing_info'         logged_in_required
//   GET       '/api/users/:id'                          logged_in_required
//   GET       '/api/users/settings/user'                logged_in_required
//   DELETE    '/api/users/logout'                       logged_in_required
//   POST      '/api/users/register'                     not_logged_in_required
//   POST      '/api/users/login'                        not_logged_in_required
//   POST      '/api/users/change_user_details'
//   POST      '/api/users/change_password/'             logged_in_required
//   POST      '/api/users/change_cc_details/'
//   PUT       '/api/users/reset_the_customer_id/:id' 
//   POST      '/api/users/login_with_pending_order/'    not_logged_in_required 
//   POST      '/api/users/register_with_pending_order'  not_logged_in_required 
//   DELETE    '/api/users/:id' 
//   PUT       '/api/users/:id'                          logged_in_required




//start the module implementation
module.exports = function (mongoose, shackleton_conn, app, User, Password) {


  //you can also do this to ensure unique fields and index emailAddress.
  //*** IMPORTANT ***
  //ensure unique email address for each user registration make an index in the schema
  //Password.index({emailAddress: 1}, {unique: true});
  
  
  //models
  var UserModel = shackleton_conn.model('User', User);
  var PasswordModel = shackleton_conn.model('Password', Password);


//---------BEGIN ROUTE HANDLERS-------------

  //TODO:
  //MUST ADD ADMIN SECURITY CONSTRAINTS.
  //->only admins must be able to get a databse dump of all users.
  //get all the users registered in database
  app.get('/api/users', logged_in_required, function (req, res) {
    console.log('in GET /api/users handler.');
    return UserModel.find(function (err, users) {
      if (!err) {
        console.log('GET api/users handler called successfully.');
        return res.send(users);
      } else {
        console.log('ERROR: GET /api/users handler. Error msg: ' + err);
        return console.log(err);
      }
    });
  });


  //respond with the req.session obj.
  //needed when app wants to check if there is a session already authenticated
  //on start up i.e. when routing to '': index in router.js routes hash.
  app.get('/api/users/session', function (req, res) {
    console.log('in GET /api/users/session handler. req.session: ' + 
      JSON.stringify(req.session, null, 4));

    console.log('in GET /api/users/session handler. req.cookie: ' + 
      JSON.stringify(req.cookies, null, 4));

    console.log('in GET /api/users/session handler. req.signedCookies: ' + 
      JSON.stringify(req.signedCookies, null, 4));

    return res.send(req.session);
  });



  app.get('/api/users/account/billing_info', logged_in_required, function (req, res) {
    console.log('in /api/users/account/billing_info');

    start_the_get_billing_info(req, res, function (err) {
      if (err) throw err;
    });

  });


  function start_the_get_billing_info(req, res, callback) {
   console.log('start_the_get_billing_info =>');

    function get_the_user() {
      console.log('start_the_get_billing_info => get_the_user');

      UserModel.findById(req.session.user_id, function (err, user) {
        if (err) return callback(err);
        if (!user) return res.send({'error': 'the_user_is_null'});

        if (user.braintree_customer_id === 'default_braintree_customer_id') {
          return res.send({'error': 'default_customer_braintree_id'});
        } else {
          get_the_cc_details_for_user(user.braintree_customer_id);
        }
      }); 
    }

    function get_the_cc_details_for_user(id) {
      console.log('start_the_get_billing_info => get_the_cc_details_for_user');

      return gateway.customer.find(id, function (err, customer) {
        console.log('found braintree_customer_id: '
          + customer.id);
        //console.log('customer: ');
        //console.log(customer);

        var details = {};

        details.expiration_date = customer.creditCards[0].expirationDate;
        details.last_4 =          customer.creditCards[0].last4;
        details.masked_number =   customer.creditCards[0].maskedNumber;

        return res.send(details);
      });
    }


    //start the process
    get_the_user();
  }




  //get a single authenticated user, via backbone fetching a user model 
  //passing in the _id to find the user
  app.get('/api/users/:id', logged_in_required, function (req, res) {
    console.log('in GET /api/users/:id handler. id param: ' + req.params.id);
    //BUG??
    return UserModel.findOne({_id: req.params.id}, function (err, user) {
      if (!err) {
        console.log('SUCCESS: in /api/users/:id , found a single user.');
        return res.send(user);
      } else {
        console.log('ERROR: in /api/users/:id , findOne error.');
        return res.redirect('#/login');
      }
    }); 
  });



  //get a single authenticated user. return the user id 
  app.get('/api/users/settings/user', logged_in_required, function (req, res) {
    console.log('in GET /api/users/settings/user handler.');

    return res.send(req.session.user_id);

  });





  //destroy the session i.e. log the user out of their account. 
  //THIS MUST BE BEFORE app.delete('/api/users/:id', ... ) handler. 
  //if not, deleting a session gets matched to the delete user handler.
  app.delete('/api/users/logout', logged_in_required, function (req, res) {
    console.log('DESTROYING SESSION in DEL /api/users/logout handler.');
    var user_first_name = req.session.user_first_name;
    req.session.destroy();

    return res.send(user_first_name);
  });


  //-------------------REGISTER--REFACTOR START--------------


  app.post('/api/users/register', not_logged_in_required, function (req, res) {

    req.checkBody('first_name', 'Empty first name').notEmpty();
    req.checkBody('last_name', 'Empty last name').notEmpty();
    req.checkBody('phone_number','Empty phone number').notEmpty();
    req.checkBody('email_address', 'Empty email address').notEmpty();
    req.checkBody('email_address', 'Not a valid email address').isEmail();
    req.checkBody('password', 'Password length must be 6 to 20 characters').len(6, 20);
    
    req.sanitize('first_name').xss();
    req.sanitize('last_name').xss();
    req.sanitize('phone_number').xss();
    req.sanitize('email_address').xss();
    req.sanitize('password').xss();


    var errors = req.validationErrors();

    if (errors) {
      return res.send({'errors': errors});
    }
   
    register_a_new_user(req, res, function (err) {
      if (err) {
        throw err;
      }
    });

  });

  function register_a_new_user(req, res, callback) {
    console.log('=> register_a_new_user =>');

    var the_hash;
    var the_salt;
    var input_form_data = {};

    //must put in default values for all fields in the UserModel.
    //if not, because fields have required:true set, err obj will be triggered.
    //in PUT /api/users/:id we dont use user_defaults to fill in empty fields,
    //which WILL then generate an error as wanted.
    //cycle through the req.body object to set values to the user document.
    //
    //user_defaults contains no password key => we dont save password to user model!
    //which is a good thing because we dont want to save password clearText in database
    for(key in user_defaults) {
      if (!req.body[key]) {
        input_form_data[key] = user_defaults[key]; 
      } else {
        input_form_data[key] = req.body[key];
      }
    }


   //generate a new salt
   function generate_the_salt() {
     console.log('=> register_a_new_user => generate_a_new_salt');
     bcrypt.genSalt(10, generate_the_hash);

   }

   function generate_the_hash(err, salt) {
     console.log('=> register_a_new_user => generate_the_hash');
     if (err) {
       return callback(err);
     }
     if (!salt) {
       return callback({'error': 'generated_salt_is_null'});     
     }
     the_salt = salt;
     bcrypt.hash(req.body.password, salt, the_hash_callback);

   }

   function the_hash_callback (err, hash) {
     console.log('=> register_a_new_user => the_hash_callback');
     if (err) {
       return callback(err);
     }
     if (!hash) {
       return callback({'error': 'generated_salt_is_null'});
     }
     the_hash = hash;  
     create_a_new_password_model();
   }

   function create_a_new_password_model() {
     console.log('=> register_a_new_user => create_a_new_password_model');
     var password_model = new PasswordModel({
       email_address: req.body.email_address,
       salt: the_salt,
       hash: the_hash
     }); 
 
     password_model.save(callback);
     create_a_new_user();
   }
 
   function create_a_new_user() {
     console.log('=> register_a_new_user => create_a_new_user');
     console.log(input_form_data);

     var user = new UserModel(input_form_data); 

     return user.save(function (err) {
       if (err) {
         return callback(err);
       }
       req.session.user_authenticated = true;
       req.session.user_id = user._id;
       req.session.user_first_name = user.first_name;
       req.session.user_last_name = user.last_name;
       req.session.user_email_address = user.email_address;

       email_services.send_welcome_email(
         user.first_name, 
         user.email_address);


       return res.send({'registration_success': true});
     });
   }
  
   //START: start the function calls 
   generate_the_salt();
  }


  app.post('/api/users/login', not_logged_in_required, function (req, res) {
    console.log('in POST /api/users/login');

    req.checkBody('email_address', 'Empty email address entered').notEmpty();
    req.checkBody('password', 'Empty password entered').notEmpty();
    req.checkBody('email_address', 'Not a valid email address').isEmail();
    
    req.sanitize('email_address').xss();
    req.sanitize('password').xss();


    var errors = req.validationErrors();

    if (errors) {
      return res.send({'errors': errors});
    }


    log_the_user_in(req, res, function (err) {
      if (err) {
        throw err;
      }
    });
  });

  function log_the_user_in(req, res, callback) {
    console.log('=> log_the_user_in =>');
    console.log('req.body: ');
    console.log(req.body);

    //need to hang onto the some obj references between fn calls   
    var the_stored_pass; 
    var the_found_user;

    function find_the_user () {
      console.log('=> log_the_user_in => find_the_user');
      UserModel.findOne({email_address: req.body.email_address}, the_user_callback);
    }

    function the_user_callback (err, user) {
      console.log('=> log_the_user_in => the_user_callback');
      if (err) {
        return callback(err);
      }
      if (!user) {
        return res.send({'error': 'user_is_null'});
      }
      the_found_user = user;
      find_password_model();
    }

    function find_password_model () {
      console.log('=> log_the_user_in => find_password_model');
      PasswordModel.findOne({email_address: req.body.email_address}, calculate_hash);
    }
       
    function calculate_hash(err, pass) {
      console.log('=> log_the_user_in => in calculate_hash');
      if (err) {
        return callback(err);
      }
      if (!pass) {
        return res.send({'error': 'password_is_null'});
      }
      the_stored_pass = pass;
      bcrypt.hash(req.body.password, pass.salt, authenticate_user);
    }
       
    function authenticate_user(err, submitted_hash) {
      console.log('=> log_the_user_in => authenticate_user');
      if (err) {
        return callback(err);
      }
      if (!submitted_hash) {
        return res.send({'error': 'hash_calculated_from_submitted_password_is_null'});
      }
      if (submitted_hash === the_stored_pass.hash) {
        console.log('*** USER SUPPLIED A VALID PASSWORD ***');
        req.session.user_authenticated = true;
        req.session.user_email_address = req.body.email_address;
        set_more_session_variables();
 
      } else {
        console.log('*** USER DID _NOT_ SUPPLY A VALID PASSWORD ***');
        req.session.user_authenticated = false;
        return res.send({user_authenticated: false}); 
      }
    }
      
    function set_more_session_variables(){
      console.log('=> log_the_user_in => set_some_variable');
      req.session.user_last_name = the_found_user.last_name;
      req.session.user_first_name = the_found_user.first_name;
      req.session.user_id = the_found_user._id;
      return res.send({user_authenticated: true, user_id: the_found_user._id});
    }


    //START: start the function calls 
    find_the_user();
  }

  /*
  //dont think this is USED ANYMORE!
  //it was called from the user account settings view when they submit changes to
  //their settings.
  //a new approach of creating a user backbone model clientside, then saving it,
  //now calls PUT /api/users/:id
  app.post('/api/users/change_user_details', function (req, res) {
    console.log('hello from POST /api/users/change_user_details');
    console.log('req.body:');
    console.log(req.body);



    req.checkBody('first_name', 'Empty first name').notEmpty();
    req.checkBody('last_name', 'Empty last name').notEmpty();
    req.checkBody('phone_number','Empty phone number').notEmpty();
    req.checkBody('email_address', 'Empty email address').notEmpty();
    req.checkBody('email_address', 'Not a valid email address').isEmail();
    
    req.sanitize('first_name').xss();
    req.sanitize('last_name').xss();
    req.sanitize('phone_number').xss();
    req.sanitize('email_address').xss();


    var errors = req.validationErrors();

    if (errors) {
      return res.send({'errors': errors});
    }



    update_user_details(req, res, function (err) {
      if (err) throw err;
    });  

  });


  function update_user_details(req, res, callback) {
    console.log('=> update_user_details => ');
    var the_details_to_update = {};
    var the_user;
    var the_user_password_doc;

    // STEPS
    // -check the user update input sent in, validate/sanitize.
    // -find the user given req.session.user_email_address
    // -update the fields which user wants to update in user doc
    //  if email address is changed then:
    //  1. update the corresponding PasswordModel for the user to have new email address
    //  2. update the braintree customer record to have a new email address. be careful
    //     to keep the same customer id, otherwise will also have to update that as well
    //     on our server
   
    function check_input() {
      console.log('=> update_user_details => ');

      for (var key in req.body) {
        if (req.body[key]) {
          the_details_to_update[key] = req.body[key];
        }
      }

      console.log('the_details_to_update');
      console.log(the_details_to_update);
      find_the_user();
    }

    function find_the_user() {
      console.log('=> update_user_details => find_the_user');
      UserModel.findOne({email_address: req.session.user_email_address}, the_found_user);
    }
 
    function the_found_user(err, user) {
      console.log('=> update_user_details => the_found_user');
      if (err) return callback(err);
      if (!user) return res.send({'error': 'user_is_null'});
     
      the_user = user; 

      for (var key in the_details_to_update) {
        the_user[key] = the_details_to_update[key]; 
      }


      if (the_user.braintree_customer_id !== 'default_braintree_customer_id') {
        console.log('the user HAS a braintree customer id => must update that too');
        console.log('braintree_customer_id: ' + the_user.braintree_customer_id);
        update_the_user_in_braintree_account();
      }        

      //if the user wants to change their email address, you must also change it in the
      //password doc associated with the user!
      if (the_details_to_update.email_address) {
        console.log('the user wants to change their email address to: ' + 
          the_details_to_update.email_address);

        PasswordModel.findOne({email_address: req.session.user_email_address},
          the_found_password_doc);

      } else {
        update_the_session_variables();
        save_the_updated_user_fields();
      }

    }



    function the_found_password_doc(err, pass_doc) {
      console.log('=> update_user_details => the_found_password_doc');
      if (err) return callback(err);
      if (!pass_doc) return res.send({'error': 'password_doc_is_empty'});
      
      console.log('the old pass doc:');    
      console.log(pass_doc);
 
      the_user_password_doc = pass_doc; 
      the_user_password_doc.email_address = the_details_to_update.email_address;

      save_the_updated_password_doc();
    }


    function save_the_updated_password_doc() {
      console.log('=> update_user_details => save_the_updated_password_doc');
      the_user_password_doc.save(function (err, pass) {
        if (err) return callback(err);
        
        console.log('the password doc associated with user saved properly');
        console.log('the new pass doc:');    
        console.log(the_user_password_doc);

        save_the_updated_user_fields(); 
        update_the_session_variables();
      }); 
    }


    function update_the_user_in_braintree_account() {
      console.log('=> update_user_details => update_the_user_in_braintree_account');

      //translate the update fields into fields expected by braintree
      var braintree_update_fields = {};
      
      if (the_details_to_update.first_name) {
        braintree_update_fields.firstName = the_details_to_update.first_name;
      }
      if (the_details_to_update.last_name) {
        braintree_update_fields.lastName = the_details_to_update.last_name;
      }
      if (the_details_to_update.phone_number) {
        braintree_update_fields.phone= the_details_to_update.phone_number;
      }
      if (the_details_to_update.email_address) {
        braintree_update_fields.email = the_details_to_update.email_address;
      }
   
      console.log('the user customer id before updating: ' 
        + the_user.braintree_customer_id);

      console.log(braintree_update_fields);

      gateway.customer.update(
        the_user.braintree_customer_id, 
        braintree_update_fields,
        function (err, result) {
          if (err) {
            console.log(err);
            return callback(err);
          }

          if (!result.success) return res.send(result);

          console.log('SUCCESS: result from updating customer in vault:');
          console.log(result);

        }
      );

    }


    function save_the_updated_user_fields() {
      console.log('=> update_user_details => save_the_updated_user_fields');
      return the_user.save(function (err, user) {
        if (err) return callback(err);
        return res.send(user); 
      });
    }


    function update_the_session_variables() {
      console.log('=> update_user_details => update_the_session_variables');

      if (the_details_to_update.first_name) {
        req.session.user_first_name = the_details_to_update.first_name;
      }
      
      if (the_details_to_update.last_name) {
        req.session.user_last_name = the_details_to_update.last_name;
      }

      if (the_details_to_update.email_address) {
        req.session.user_email_address = the_details_to_update.email_address;
      }
    }


    //START: start the function calls
    check_input();
  }
  */





  app.post('/api/users/change_password/', logged_in_required, function (req, res) {
    console.log('in /api/users/change_password');
    console.log('req.body.new_password_1' + req.body.new_password_1);
    console.log('req.body.new_password_2' + req.body.new_password_2);



    req.checkBody('new_password_1', 'Password length must be 6 to 20 characters')
      .len(6, 20);
    req.checkBody('new_password_2', 'Password length must be 6 to 20 characters')
      .len(6, 20);
    
    req.sanitize('new_password_1').xss();
    req.sanitize('new_password_2').xss();


    var errors = req.validationErrors();

    if (errors) {
      return res.send({'errors': errors});
    }


    start_password_change(req, res, function (err) {
      if (err) throw err;
    });
  });

  function start_password_change(req, res, callback) {
    var the_salt;
    var the_hash;
    var the_password_doc;

    function compare_the_passwords() {
     console.log('=> start_password_change => compare_the_passwords');

      if (!req.body.new_password_1 || !req.body.new_password_2) {
        console.log('one or both of the password fields are blank/null/undefined');
        return res.send({'error': 'passwords_or_password_is_blank'});
      }

      if (req.body.new_password_1 !== req.body.new_password_2) {
        console.log('the 2 passwords DO NOT MATCH');
        return res.send({'error': 'passwords_do_not_match'});
      } else {
        console.log('the 2 passwords MATCH');
        generate_the_salt();
      }
    }



   //generate a new salt
   function generate_the_salt() {
     console.log('=> start_password_change => generate_the_salt');
     bcrypt.genSalt(10, generate_the_hash);

   }

   function generate_the_hash(err, salt) {
     console.log('=> start_password_change => generate_the_hash');
     if (err) {
       return callback(err);
     }
     if (!salt) {
       return callback({'error': 'generated_salt_is_null'});     
     }
     the_salt = salt;
     bcrypt.hash(req.body.new_password_1, salt, the_hash_callback);

   }

   function the_hash_callback (err, hash) {
     console.log('=> start_the_password_change => the_hash_callback');
     if (err) {
       return callback(err);
     }
     if (!hash) {
       return callback({'error': 'generated_salt_is_null'});
     }
     the_hash = hash;  
     find_the_password_doc();
   }

   function find_the_password_doc () {
     console.log('=> start_the_password_change => find_the_password_doc');
     PasswordModel.findOne(
       {email_address: req.session.user_email_address}, 
        the_password_callback
     );
   }
 
   function the_password_callback(err, password_doc) {
     console.log('=> start_the_password_change => the_password_callback');
     if (err) {
       return callback(err);
     }
     if (!password_doc) {
       return callback({'error': 'password_doc_is_null'});     
     }
 
     console.log(password_doc);
     console.log('the_salt: ' + the_salt);
     console.log('the_hash: ' + the_hash);


     the_password_doc =      password_doc; 
     the_password_doc.salt = the_salt;
     the_password_doc.hash=  the_hash;

     save_the_password_doc();
   }
 
   function save_the_password_doc() {
     console.log('=> start_the_password_change => save_the_password_doc');
     return the_password_doc.save(function (err) {
       if (err) return callback(err);
       
       return res.send({'success': 'password_update_successful'});
     });
   }


    //start the function calls
    compare_the_passwords();
  }



  //used in account 1. => billing => change cc 
  //                2. => billing default => submit cc
  //returns customer obj if user does not have a cc in vault already
  //OR
  //return braintree result obj if user does have a cc in vault
  app.post('/api/users/change_cc_details/', function (req, res) {
    console.log('in POST /api/users/change_cc_details handler');
    console.log(req.body);

    /*
    req.checkBody('cc_number', 'Credit Card number is empty').notEmpty();
    req.checkBody('cc_cvv', 'Credit Card CVV is empty').notEmpty();
    req.checkBody('cc_month', 'Credit Card expiration month is empty').notEmpty();
    req.checkBody('cc_year', 'Credit Card expiration year is empty').notEmpty();

    req.sanitize('cc_number').xss();
    req.sanitize('cc_cvv').xss();
    req.sanitize('cc_month').xss();
    req.sanitize('cc_year').xss();


    var errors = req.validationErrors();

    if (errors) {
      return res.send({'errors': errors});
    }
    */


    change_cc_in_vault_for_user(req, res, function (err) {
      if (err) throw err;
    });
  });

  function change_cc_in_vault_for_user(req, res, callback) {
    console.log('=> change_cc_in_vault_for_user =>');

    var the_user;

    function find_user() {
      console.log('=> change_cc_in_vault_for_user => find_user');
      UserModel.findById(req.session.user_id, the_user_callback);
    }

    function the_user_callback(err, user) {
      console.log('=> change_cc_in_vault_for_user => the_user_callback');
      if (err) return callback(err);
      if (!user) return res.send({'error': 'user_is_null'});  

      the_user = user;
      submit_cc_to_braintree();
    }

    function submit_cc_to_braintree() {
      console.log('=> change_cc_in_vault_for_user => submit_cc_to_braintree');


      //TODO: implement the default_braintree_customer_id case.
      if (the_user.braintree_customer_id === 'default_braintree_customer_id') {
        console.log('user does NOT have a cc in vault');
        //create a customer, submit the cc details 
        user_has_not_yet_submitted_cc();


      } else {
        console.log('user DOES have a cc in vault');
        //user already has a braintree_customer_id set, just change the cc for the
        //customer in the braintree vault
        user_already_has_a_cc_in_vault();

      }
    }


    function user_already_has_a_cc_in_vault() {
      console.log('=> change_cc_in_vault_for_user => user_already_has_a_cc_in_vault');
      gateway.customer.find(the_user.braintree_customer_id, function (err, customer) {
        token = customer.creditCards[0].token;
        update_the_customer_cc(token);
      });
    }


    function update_the_customer_cc(token) {
 
      return gateway.customer.update(
        the_user.braintree_customer_id, 
        {
          creditCard: {
            number: req.body.cc_number,
            cvv: req.body.cc_cvv,
            expirationMonth: req.body.cc_month,
            expirationYear: req.body.cc_year,
            options: {updateExistingToken: token}
          }   
        }, 
        function (err, result) {
          if (err) return callback(err);
          if (!result.success) return res.send(result);
          console.log('result from updating cc in vault: ');
          console.log(result);
          console.log(result.customer.creditCards[0]);
          return res.send(result);
        }
      );
    }


    function user_has_not_yet_submitted_cc() {
      console.log('=> change_cc_in_vault_for_user => user_has_not_yet_submitted_cc');

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

          the_user.braintree_customer_id = result.customer.id;

          save_the_user_changes();

          var details = {};

          details.expiration_date = result.customer.creditCards[0].expirationDate;
          details.last_4 =          result.customer.creditCards[0].last4;
          details.masked_number =   result.customer.creditCards[0].maskedNumber;

          return res.send(details);

        } else {
          //braintree send back result.success = false
          return callback(result);
        }
      });
    }


    function save_the_user_changes() {
      console.log('=> change_cc_in_vault_for_user => save_the_user_changes');
      the_user.save(function(err) {
        if (err) {
          return callback(err);
        }
        console.log('user updates saved');
        //return res.send(the_user); 
      });
    }



    //start the function calls
    find_user();
  }



  //sets the braintree_customer_id back to the default 'default_braintree_customer_id'
  //which is used in PUT /api/orders during checkout process for asking braintree
  //to issue a new customer_id. this happend when the cc details in the users vault
  //changes.
  app.put('/api/users/reset_the_customer_id/:id', 
    restrict_user_to_self, 
    function (req, res) {

      console.log('in PUT /api/users/reset_the_customer_id/:id');
      update_user_braintree_customer_id(req, res, function (err) {
        if (err) {
          throw err;
        }
      });
  });

  function update_user_braintree_customer_id(req, res, callback) {
    var new_values = {};
    var the_user;

    for (var key in req.body) {
      new_values[key] = req.body[key];
    }

    UserModel.findById(req.session.user_id, function (err, user) {
      if (err) {
        return callback(err);
      }
      if (!user) {
        return res.send({'error': 'user_is_null'});
      }
      the_user = user;
      the_user.braintree_customer_id = "default_braintree_customer_id";

      the_user.save(function (err) {
        if (err) {
          return callback(err);
        }
        return res.send({'successful_reset': true});
      });
    }); 
  }










//__________________REFACTOR FINISH___________________________



  //TODO: refactor all the nested functions. do you need all thses return keywords?
  //user login handler
  app.post('/api/users/login_with_pending_order/', not_logged_in_required, 
    function (req, res) {

    console.log('in POST /api/users/login_with_pending_order/ handler.');


    for (key in req.body) {
      console.log('login_with_pending_order: req.body[' + key + '] = ' + req.body[key]);
    }

    //get the password hash from the password database, authenticate the sent in password
    //then set up the session if successful. if not, log the errors or redirect to
    //login form again.
    return PasswordModel.findOne({
      emailAddress: req.body.emailAddress}
      , function (err, passwordDoc){

        //make sure that passwordDoc is not null i.e. that there is a doc in the collection
        //for the emailAddress supplied.
        if (!err && passwordDoc) {
         
          //calculate the hash of the sent in password. need to compare the result to the
          //hash stored in our passwords_database to decide authentication of user.
          bcrypt.hash(req.body.password, passwordDoc.salt, function (err, submittedHash) {
            if (!err) {
            
              //AUTHORISATION PROCEDURE
              if (submittedHash === passwordDoc.hash) {

                //we have an authenticated user
                req.session.user_authenticated = true;

                //now find the user and set the req.session values.
                return findTheUserAndSetSessionWithPendingOrder(req, res);           
              } else {

                console.log('*** user in NOT authenicated ** ' 
                  + 'in POST /api/users/login_with_pending_order/ handler.');
                //NOT authenticated user
                req.session.user_authenticated = false;
                //return res.redirect('#/login');
                return res.send({user_authenticated: false});
              }
            } else {

              console.log('ERROR: /api/users/login_with_pending_order/: hashing error of submitted hash');
              req.session.user_authenticated = false;
              return res.redirect('#/login');
            }
          }); 
        } else { //no PasswordModel found for emailAddress supplied.

          console.log('ERROR: unable to find passwordDoc for that emailAddress. Err msg ' 
            + err);
          req.session.user_authenticated = false;
          return res.redirect('#/login');
        }
      }
    );
  });





  //REGISTER WITH PENDING ORDER API---------------------

  //create a new user who has a pending order
  //SECURITY: an authenticated user CANNOT create another account. (?)
  app.post('/api/users/register_with_pending_order', not_logged_in_required, 
    function (req, res) {

    console.log('in POST /api/users/register_with_pending_order => creating a new user.');

    var inputFormData = {};

    //must put in default values for all fields in the UserModel.
    //if not, because fields have required:true set, err obj will be triggered.
    //in PUT /api/users/:id we dont use user_defaults to fill in empty fields,
    //which WILL then generate an error as wanted.
    //cycle through the req.body object to set values to the user document.
    for(key in user_defaults) {
      if (!req.body[key]) {
        inputFormData[key] = user_defaults[key]; 
      } else {
        inputFormData[key] = req.body[key];
      }
    }
 
    //creating a bcrypt hash of the password sent during signup
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (!err) {

         //instantiate a new password document for the User
         var password = new PasswordModel({
           emailAddress: req.body.emailAddress, 
           salt: salt, 
           hash: hash
           });
 
         password.save(function (err) {
           if (!err) {
             console.log('SUCCESS: in POST /api/users/register. Saving password.');
             console.log('password.emailAddress: ' + password.emailAddress);
             console.log('password.salt: '         + password.salt);
             console.log('password.hash: '         + password.hash);

             req.session.user_emailAddress = password.emailAddress; 

             //only instantiate a new user if emailAddress passed in is unique.
             //otherwise, callback will have an non null err obj
             var user = new UserModel(inputFormData);
             
             return user.save(function (err) {
               if (!err) {
                 console.log('SUCCESS: in POST /api/users/register_with_pending_order handler. emailAddress: ' 
                   + user.emailAddress);

                 //set user _id in the session object now. needed for PUT /api/users/:id
                 //handler, as you want to use route middleware restrict_user_to_self in the
                 //route handler. otherwise, someone can register an account, and change other
                 //users documents by simply guessing their _id and making the PUT request.
                 //set some session variables
                 req.session.user_id = user._id;
                 req.session.user_authenticated = true;

                 //send an email to account to verify registration of user
                 //response is to say check your email account for link to verify account.
                 return res.send({'authenticated': true, 'user_id': user._id});
               } else {
                 console.log('ERROR: in POST /api/users/register_with_pending_order handler. Error msg: ' + err);
                 return res.send('ERROR in creating a new account. Error msg: '
                   + err);
               }
             });
           } else {

             //this block of code is accessed if user tries to create an account which
             //already exists i.e. there is already and account using that email.

             console.log('ERROR: in POST /api/users/register_with_pending_order. ' 
               + ' Trying to save password document. Error msg: '
               + err);
             return res.send('ERROR: in POST /api/users/register_with_pending_order. Error msg' + err);
           }        
         });
        } else {
          console.log('ERROR: in POST /api/users/register_with_pending_order. Trying to generate bcrypt.' 
          + err);
        }
      });
    });   
  });






  //delete a user with id
  app.delete('/api/users/:id', 
    logged_in_required, restrict_user_to_self, 
    function (req, res) {

    console.log('in DEL /api/users/:id handler');

    return UserModel.findById(req.params.id, function (err, user) {
      if (!err) {
        return user.remove(function (err) {
          if (!err) {
            console.log('SUCCESS: deleted user with id = ' + req.params.id);

            //*** IMPORTANT - backbone expects a JSON response to sync ***
            //Backbone expects a JSON response from the server. If not, then an error
            //event is generated => server and backbone cant sync.
            //when responding from a model.destroy() call, you can simply return a 
            //serialization of an empty JSON hash.
            return res.send(JSON.stringify({}));
          } else {
            console.log('ERROR: in DEL /api/gigs/:id handler. Error msg: ' + err);

            return res.send(JSON.stringify({}));
          }
        });
      } else {
        return res.send('ERROR: in DEL /api/users/:id handler. Error msg: ' + err);
      }
    });
  });


  //called when user updates their attributes in the account settings view
  app.put('/api/users/:id', logged_in_required, function (req, res) {
    console.log('in PUT /api/users/:id handler');
    console.log(req.body);


    req.checkBody('first_name', 'Empty first name').notEmpty();
    req.checkBody('last_name', 'Empty last name').notEmpty();
    req.checkBody('phone_number','Empty phone number').notEmpty();
    req.checkBody('email_address', 'Empty email address').notEmpty();
    req.checkBody('email_address', 'Not a valid email address').isEmail();
    
    req.sanitize('first_name').xss();
    req.sanitize('last_name').xss();
    req.sanitize('phone_number').xss();
    req.sanitize('email_address').xss();


    var errors = req.validationErrors();

    if (errors) {
      return res.send({'errors': errors});
    }

    //n.b. this is req.params i.e. plural, and is an object
    //console.log('req.params');
    //console.log(req.params);


    //n.b this is req.param i.e. singular and is a function
    //req.param is a function which you can call, supply the variable name & then get
    //the value out. even variables sent in in the body. i.e.:
    //console.log('req.param(\'first_name\')');
    //console.log(req.param('first_name'));

    UserModel.findById(req.session.user_id, function (err, user) {
      if (err) throw(err);
      if (!user) return res.send({'error':'user_is_null'});
 
      user.first_name = req.param('first_name'); 
      user.last_name = req.param('last_name'); 
      user.phone_number= req.param('phone_number'); 
      user.email_address = req.param('email_address'); 

      return user.save(function(err, saved_user) {
        if (err) throw(err);
        if (!saved_user) return res.send({'error':'user_is_null'});
        
        return res.send(saved_user);
      });
    }); 
  });






  //----------start: NEW FEATURE TESTING SECTION-------------------

  //----------finish: NEW FEATURE TESTING SECTION-------------------

}; //end module.exports
