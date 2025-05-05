var input = document.getElementById("busqueda");
var resultados = document.getElementById("resultados");
var xhr = new XMLHttpRequest();
xhr.open("GET", "pokemon.json", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var datos = JSON.parse(xhr.responseText);
    input.addEventListener("input", function() {
      var texto = input.value.toLowerCase();
      resultados.innerHTML = "";
      for (var i = 0; i < datos.length; i++) {
        var p = datos[i];
        if (p.nombre.toLowerCase().indexOf(texto) !== -1 || String(p.numero).indexOf(texto) !== -1) {
          var div = document.createElement("div");
          div.className = "pokemon";
          div.innerHTML = "<strong>" + p.numero + " - " + p.nombre + "</strong><br>Tipo: " + p.tipo.join(", ");
          resultados.appendChild(div);
        }
      }
    });
  }
};
xhr.send();
