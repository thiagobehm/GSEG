$(document).ready(function() {

  $(document).on('click', '.submit', function() {

    var data = $('#myForm ').serialize();

    $.ajax('/form', {
      type: 'POST',
      data: data,
      success: function(data) {
        $('.contato').html(data);
      },
      error: function() {
        console.log('error');
      }
    });
  });

  $('.navbar-collapse a').click(function() {
    $(".navbar-collapse ").collapse('hide');
  });
});
