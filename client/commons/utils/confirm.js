function Confirm(title, msg, trueBTN, falseBTN,cb) { /*change*/
  var $content = "<div class='dialog-ovelay alert_pop'>" +
    "<div class='dialog'><header>" +
    " <h3> " + title + " </h3> " +
    "<span class='close'> <i class='fa fa-close'></i></span>" +
    "</header>" +
    "<div class='dialog-msg'>" +
    " <p> " + msg + " </p> " +
    "</div>" +
    "<footer>" +
    "<div class='ml_btn'>" +
    " <a href='#' class='button button-danger doAction save_btn'>" + trueBTN + "</a> " +
    " <a href='#' class='button button-default cancelAction cancel_btn'>" + falseBTN + "</a> " +
    "</div>" +
    "</footer>" +
    "</div>" +
    "</div>";

  $('body').prepend($content);
  $('.doAction').click(function (e) {
    e.preventDefault();
    $(this).parents('.dialog-ovelay').fadeOut(500, function () {
      $(this).remove();
      cb(true);
    });
  });
  $('.cancelAction, .fa-close').click(function (e) {
    e.preventDefault();
    $(this).parents('.dialog-ovelay').fadeOut(500, function () {
      $(this).remove();
      cb(false);
    });
  });

}


module.exports = Confirm;
