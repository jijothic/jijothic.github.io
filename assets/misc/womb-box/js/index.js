$(document).ready(function() {

  $('form#mc-embedded-subscribe-form').submit(function(e) {
    fbq('track', 'Lead');
    pintrk('track', 'lead');  
    return true;
  });
  
});
