({
  appDir: '../',
  baseUrl: 'js',
  dir: '../../site-build',
  mainConfigFile: 'app.js',
  paths: {
    'underscore': 'lib/underscore',
    'jquery-1.10.2.min': 'lib/jquery-1.10.2.min',
    'backbone' : 'lib/backbone',
    'text' : 'lib/text',
    'braintree': 'lib/braintree',
    'jquery-dateFormat-1.0': 'lib/jquery-dateFormat-1.0',
    'bootstrap-collapse' : 'lib/bootstrap-collapse'
  },


  //i think this is not needed...? optimization is successful withOUT it. still dont 
  //know r.js well enough to give a definitive, grok like answer.
  /*
  modules: [
    {
      //name: 'app'
    }
  ]
  */
})
