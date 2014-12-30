$(document).ready(function(){
  $('#cart-btn').popover({
    animation: true,
    placement: 'bottom',
    title: 'Preisangaben',
    html: true,
    content: function() {
      return $('#price-inf').html();
    },
    trigger: 'hover',
    delay: 100
  });
});