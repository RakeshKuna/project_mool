let progressbar=(percent)=>{ /*change*/
  var $content =
    '<div class="full_progress">'+
      '<div class="progress" >'+
        `<div id="progressbarId" class="progress-bar progress-bar-danger progress-bar-striped active" 
            role="progressbar" aria-valuenow="${percent}%" 
            aria-valuemin="0" aria-valuemax="100" style="width: ${percent}%;">
            <span>Uploading.. ${percent}%</span>
        </div>`+
      '</div>'+
    '</div>';

  if ($('.full_progress').length > 0) {
    $('#progressbarId').attr('aria-valuenow',`${percent}%`).attr('style',`width: ${percent}%;`).children('span').text(`Uploading.. ${percent}%`);
  }else{
    $('body').prepend($content);
  }
}

let removeProgressbar = (cb)=>{
  setTimeout(()=>{
    $('.full_progress').remove();
    return cb();
  },1000);
};

module.exports = {progressbar,removeProgressbar};
