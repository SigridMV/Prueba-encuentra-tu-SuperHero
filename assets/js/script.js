$(document).ready(function () {
  // input del usuario + búsqueda al presionar el boton
  $("#searchForm").submit(function (event) {
    event.preventDefault();
    // Obtener el nombre ingresado
    var heroName = $("#heroInput").val();
    searchHero(heroName);
  });

  // Función para buscar un SuperHero por nombre
  function searchHero(heroName) {
    $.ajax({
      url:
        "https://superheroapi.com/api.php/1117688596036170/search/" + heroName,
      method: "GET",
      success: function (data) {
        $("#heroCards").empty();
        if (data.results && data.results.length > 0) {
          // ID del primer SuperHero que se encontró
          var heroId = data.results[0].id;
          // Detalles del SuperHero por su ID
          getHeroDetails(heroId);
        } else {
          alert(
            "No se encontró ningún SuperHero con ese nombre. Vuelva a intentarlo"
          );
        }
      },
      error: function () {
        alert(
          "Hubo un error al buscar el SuperHero. Por favor, inténtelo de nuevo."
        );
      },
    });
  }

  // Detalles de un SuperHero utilizando su id
  function getHeroDetails(heroId) {
    $.ajax({
      url: "https://superheroapi.com/api.php/1117688596036170/" + heroId,
      method: "GET",
      success: function (data) {
        renderHeroCard(data); // Renderizar los detalles del SuperHero
        renderPieChart(data.name, data.powerstats); // Renderizar el gráfico de pastel con las estadísticas de poder
      },
      error: function () {
        alert(
          "Hubo un error al obtener los detalles del SuperHero. Por favor, inténtelo de nuevo."
        );
      },
    });
  }

  // Renderizar información de superhéroes
  function renderHeroCard(heroData) {
    var heroCardHTML = `
        <h4>SuperHeroe Encontrado</h4>
        <div class="card mb-3">
          <div class="row">
            <div class="col-md-4">
              <img src="${
                heroData.image.url
              }" class="img-fluid rounded-start" alt="${heroData.name}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title"> <i>Nombre:</i> ${heroData.name}</h5>
                <p class="card-text"><i>Conexiones:</i> ${
                  heroData.connections["group-affiliation"]
                }</p>
                <p class="card-text"><i>Publicado por:</i> ${
                  heroData.biography.publisher
                }</p>
                <p class="card-text"><i>Ocupación:</i> ${
                  heroData.work.occupation
                }</p>
                <p class="card-text"><i>Primera Aparición:</i> ${
                  heroData.biography["first-appearance"]
                }</p>
                <p class="card-text"><i>Altura:</i> ${heroData.appearance.height.join(
                  " - "
                )}</p>
                <p class="card-text"><i>Peso:</i> ${heroData.appearance.weight.join(
                  " - "
                )}</p>
                <p class="card-text"><i>Alianzas:</i> ${
                  heroData.biography["aliases"]
                }</p>
              </div>
            </div>
          </div>
          </div>
      `;
    $("#heroCards").append(heroCardHTML);
  }
  // Renderizar gráfico de pastel utilizando CanvasJS
  function renderPieChart(heroName, powerstats) {
    var dataPoints = [];
    for (var stat in powerstats) {
      dataPoints.push({ label: stat, y: parseInt(powerstats[stat]) });
    }

    var chart = new CanvasJS.Chart("chartContainer", {
      theme: "light2",
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "Estadísticas de Poder para " + heroName,
      },
      data: [
        {
          type: "pie",
          startAngle: 25,
          toolTipContent: "<b>{label}</b>: {y}%",
          showInLegend: "true",
          legendText: "{label}",
          indexLabelFontSize: 16,
          indexLabel: "{label} - {y}%",
          dataPoints: dataPoints,
        },
      ],
    });

    chart.render();
  }
});
