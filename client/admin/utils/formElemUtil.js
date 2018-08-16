export function OnToggleSwitch(isExisting, isChanged) {
  if (isExisting) {
    $('.switch input[type=checkbox]').each(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
  }
  if (isChanged) {
    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
  }

}

export function MoolyaToggleSwitch(isExisting, isChanged) {
  setTimeout(function () {
    if (isExisting) {
      $('.nocolor-switch input[type=checkbox]').each(function () {
        if ($(this).is(':checked')) {
          $('.state_label:nth-of-type(1)').removeClass('acLabel');
          $('.state_label:nth-of-type(2)').addClass('acLabel');
        } else {
          $('.state_label:nth-of-type(2)').removeClass('acLabel');
          $('.state_label:nth-of-type(1)').addClass('acLabel');
        }
      });
    }
    if (isChanged) {
      $('.nocolor-switch input[type=checkbox]').change(function () {
        if ($(this).is(':checked')) {
          $('.state_label:nth-of-type(1)').removeClass('acLabel');
          $('.state_label:nth-of-type(2)').addClass('acLabel');
        } else {
          $('.state_label:nth-of-type(2)').removeClass('acLabel');
          $('.state_label:nth-of-type(1)').addClass('acLabel');
        }
      });
    }
  }, 200);
}

export function initalizeFloatLabel() {
  $('.float-label').jvFloat();
}

export function passwordVisibilityHandler() {
  $('.password_icon').unbind().click(function () {
    if ($(this).hasClass('hide_p')) {
      $(this).parents('.form-group').find('input').attr('type', 'text');
      $(this).removeClass('hide_p').removeClass('fa-eye-slash').addClass('fa-eye');
    } else {
      $(this).parents('.form-group').find('input').attr('type', 'password');
      $(this).addClass('hide_p').removeClass('fa-eye').addClass('fa-eye-slash');
      ;
    }
  });
}

export function dataVisibilityHandler() {
  $('.fa-lock').attr('title', 'Click to make public');
  $('.fa-unlock').attr('title', 'Click to make private');
  $('.input_icon').unbind().click(function () {
    if ($(this).hasClass('un_lock')) {
      // $(this).parents('.form-group').find('input').attr('type','text');
      $(this).removeClass('un_lock').removeClass('fa-unlock').addClass('fa-lock');
      $(this).parents('.form-group').find('#makePrivate').prop('checked', true);
      $('.fa-lock').attr('title', 'Click to make public');
    } else {
      // $(this).parents('.form-group').find('input').attr('type','text');
      $(this).addClass('un_lock').removeClass('fa-lock').addClass('fa-unlock');
      $(this).parents('.form-group').find('#makePrivate').prop('checked', false);
      $('.fa-unlock').attr('title', 'Click to make private');
    }
  });
}

export function OnLockSwitch() {
  $('.lock_input[type=checkbox]').each(function () {
    if ($(this).is(':checked')) {
      $(this).prev('span').addClass('fa-lock').removeClass('un_lock').removeClass('fa-unlock');
      // $(this).parent('.switch').addClass('on');
    } else {
      $(this).prev('span').addClass('fa-unlock').addClass('un_lock').removeClass('fa-lock');
      // $(this).parent('.switch').removeClass('on');
    }
  });
}

/**
 * @func {*} to be used always after the lockPrivateKeys @callback
 * @see {*} 1) all the view files of the portfolio
 *          2) all the unlock {*FontAwesome} is been hidden with @class {*hide_unlock} used at the parent <div>
 * @todo {*} need to remove @this @func from all files and move to the {commons} path {./commons/utils/formElemUtil}
 */
export function initalizeLockTitle() {
  $('.fa-lock').attr('title', 'Marked as Private');
}
