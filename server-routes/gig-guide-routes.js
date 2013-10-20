/*
 *
 * Gig Guide Routes
 *
 */



//____________________________ROUTES (in this order in the file)____________________
//
// key x = commented out handler. staging to see if it is needed or not.
//
//___METHOD____ROUTE_____________________________________MIDDLEWARE_________________
//
//   GET       '/api/'      
//   GET       '/api/gigs'
//   POST      '/api/gigs/'
//   GET       '/api/gigs/:id'
//   PUT       '/api/gigs/:id'
//   DELETE    '/api/gigs/:id'
//   POST      '/api/gigs/reserve/:id'






//begin module implementation
module.exports = function (mongoose, shackleton_conn, app, Gig) {


  //set the 'Gig' model to use Gig schema
  //Connection.model(name, [schema], [collection])
  //-> since no collection is specified, collection name is 'name' argument pluralized.
  var GigModel = shackleton_conn.model('Gig', Gig); 
  



  //******** ROUTE HANDLER ******************************

  //USED???
  app.get('/api', function (req, res) {
    res.send('Gigs API is up and running.');
  });
  
  


  //******** ROUTE HANDLER ******************************

  //get a list of all the gigs
  app.get('/api/gigs', function (req, res) {
  
    return GigModel.find(function (err, gigs) {
      if(!err) {
        console.log('GET /api/gigs handler called successfully.');
        return res.send(gigs);
      } else {
        console.log('ERROR: GET /api/gigs handler. Error msg: ' + err);
        return console.log(err);
      }
    });
  });
  



  //******** ROUTE HANDLER ******************************

  //create a gig
  app.post('/api/gigs/', function (req, res) {
  
    console.log('POST /api/gigs/ => creating a gig');
    console.dir(req.body.tag_names);

    var gig = new GigModel({
     main_event:         req.body.main_event,
     event_date:         req.body.event_date,
     opening_time:       req.body.opening_time,
     venue:              req.body.venue,
     price:              req.body.price,
     supports:           req.body.supports,
     age_group:          req.body.age_group,
     description:        req.body.description,
     tag_names:          req.body.tag_names,
     main_image_url:     req.body.main_image_url,
     thumbnail_url:      req.body.thumbnail_url,
     capacity:           req.body.capacity
     //image_url:        req.body.image_url
    });
  
    gig.save(function (err){
      if (!err) {
        return console.log('SUCCESS: in POST /api/gigs/ handler.  gig.main_event = '
          + req.body.main_event);
      } else {
        console.log('ERROR: in POST /api/gigs/ handler. Error msg: ' + err);
      }
    });

    //put this in gig.save callback to prevent a bug if saving takes too long?
    return res.send(gig);
  });
  


  

  //******** ROUTE HANDLER ******************************

  //get a single gig using its id param passed in with the req
  app.get('/api/gigs/:id', function (req, res) {
  
    return GigModel.findById(req.params.id, function (err, gig) {
      if (!err) {
        console.log(JSON.stringify(gig));
        return res.send(gig);
      } else {
        console.log('ERROR: in GET /api/gigs/id handler. Error msg: ' + err);
        return res.send('ERROR: in GET /api/gigs/:id handler. Error msg: ' + err);
      }
    });
  });
  
  


  //******** ROUTE HANDLER ******************************

  //update a gig with id
  app.put('/api/gigs/:id', function (req, res) {
  
    console.log('updating gig ' + req.body.main_event);
  
    return GigModel.findById(req.params.id, function (err, gig) {
      if(!err) {
          gig.main_event =        req.body.main_event;
          gig.event_date =        req.body.event_date;
          gig.opening_time =      req.body.opening_time;
          gig.venue =             req.body.venue;
          gig.price =             req.body.price;
          gig.supports =          req.body.supports;
          gig.age_group =         req.body.age_group;
          gig.description =       req.body.description;
          gig.tag_names =         req.body.tag_tames;
          gig.main_image_url =    req.body.image_url;
          gig.thumbnail_url =     req.body.thumbnail_url;
          gig.capacity =          req.body.capacity;
  
          return gig.save(function (err) {
            if (!err) {
              console.log('gig with id = ' + req.params.id + ' has been updated');
            } else {
              console.log('ERROR: in PUT /api/gigs/:id handler. Error msg: ' + err);
            }
            return res.send(gig);
          });
      } else {
        //error in findById callback
        console.log(err);
        return res.send('ERROR: in PUT /api/gigs/:id handler. Error msg: ' + err);
      }
    });
  });
  
  


  //******** ROUTE HANDLER ******************************

  //delete the gig with id
  app.delete('/api/gigs/:id', function (req, res) {
  
    console.log('deleting gig with id = ' + req.params.id);
  
    return GigModel.findById(req.params.id, function (err, gig) {
      if (!err) {
        return gig.remove(function (err) {
          if (!err) {
            console.log('deleted gig with id = ' + req.params.id);
          } else {
            console.log('ERROR: in DELETE /api/gigs/:id handler. Erro msg: ' + err);
          }
        });
      } else {
        return res.send('ERROR: in DELETE /api/gigs/:id handler. Error msg: ' + err);
      }
    });
  });





  //******** ROUTE HANDLER ******************************

  //USED???
  //reserve a particular gig with a given number of tickets
  app.post('/api/gigs/reserve/:id', function (req, res) {
    console.log('in POST /api/gigs/reserve/:id handler ' 
      + 'req.params.id= ' + req.params.id
      + 'req.body.number_of_tickets= ' + req.body.number_of_tickets
    );

    //res.cookie('reserveTicketsCookie', {maxAge: 1000 * 60});

    
    //set a reservation cookie, which atm is PUBLIC, with a low TTL
    //for holding onto tickects selected.
    //console.log('res.cookies= ' + JSON.stringify(res.cookies));


    GigModel.findById(req.params.id, function (err, result) {
      if(err) {
        console.log('ERROR: in post /api/gigs/reserve/:id handler. Err ' + err);
        return res.send('ERROR: in post /api/gigs/reserve/:id handler. Err ' + err);
      } else {
        var total_amount = req.body.number_of_tickets * result.price;

        console.log('SUCCESS in POST /api/gigs/reserver/:id handler.'
          + 'total amount= number_of_tickets * ticket price= '
          + req.body.number_of_tickets + ' * ' + result.price 
          + ' = ' + total_amount
        );

        res.send('SUCCESS in POST /api/gigs/reserver/:id handler.'
          + 'total amount= number_of_tickets * ticket price= '
          + req.body.number_of_tickets + ' * ' + result.price 
          + ' = ' + total_amount
        );
      }
    });
  });


};  //end module.exports
