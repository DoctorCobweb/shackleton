/*
 *
 * Module which makes the eTicket pdf, then sends it onto email services module 
 *
 */


var email_services = require('./email_services'),
    PDFKit = require('pdfkit'),
    fs = require('fs'),
    //_ = require('underscore'),
    QRCode = require('qrcode');



var create = function (order, user_first_name, user_email_address) {
  console.log('HELLO from eticket module, create function');

  // the '/////' used in the string is for parsing the fields when the qrcode is
  //scanned
  var info_in_qrcode = order._id.toString() +
                       '/////' +
                       order.first_name +
                       '/////' +
                       order.last_name +
                       '/////' +
                       order.main_event +
                       '/////' +
                       order.number_of_tickets.toString(10) +
                       '/////' +
                       order.transaction_status;

  console.log('in eticket module, info_in_qrcode: ' + info_in_qrcode);


  QRCode.toDataURL(info_in_qrcode, function(err, url){
    console.log('in QRCODE.toURL call, url: ');
    console.log(typeof(url));
  
    //strip away the 'data:image/png;base64,' part from url
    var comma_index = url.indexOf(',');
    console.log(comma_index); //21
  
    url = url.substring(22);
  
    //console.log('the base64 encoded value in QRCODE: ' + url);
  
    //is this flaky? writing to an ephemeral fs
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
       .text('hello ' + user_first_name + ',')
       .text('this is your tiket to the show.')
       .text('please keep it safe.')
       .moveDown()
       .moveDown()
       .text('__DETAILS__')
       .text('EVENT: ' + order.main_event)
       .text('DATE: ' + order.event_date)
       .text('OPENING_TIME: ' + order.opening_time)
       .text('VENUE: ' + order.venue)
       .text('AGE_GROUP: ' + order.age_group)
       .text('FIRST_NAME: ' + order.first_name)
       .text('LAST_NAME: ' + order.last_name)
       .text('NUMBER_OF_TIKETS: ' + order.number_of_tickets)
       .moveDown()
       .moveDown()
       .text('__DEBUGGING__')
       .text('ORDER_ID: ' + order._id.toString())
       .text('TRANSACTION_STATUS: ' + order.transaction_status)



      .image('./first_qr_code.png', 50, 500 ) //relative to server.js location!
  
      .output(function (result) {
        console.log('typeof(result): ' + typeof(result));
        //console.log(result);
  
        email_services.send_ticket_purchase_email(
  	user_first_name,
  	user_email_address,
  	result);
      });
  }); //end QRCode.toDataURL
}; //end create function


module.exports.create = create;
