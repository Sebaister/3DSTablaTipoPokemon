// Versión compatible con 3DS
function showType(typeId) {
  var details = document.getElementsByClassName('type-detail');
  for (var i = 0; i < details.length; i++) {
    details[i].style.display = 'none';
  }
  
  var el = document.getElementById(typeId);
  if (el) {
    el.style.display = 'block';
    el.scrollIntoView();
  }
}

// Inicialización segura para 3DS
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', function() {
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
      details[i].style.display = 'none';
    }
  });
}
