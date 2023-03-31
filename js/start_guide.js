function startGuide(){
    var request = new XMLHttpRequest();
    request.open("GET", "https://oliphant0803.github.io/piechart_with_timeline/toursteps.json", false);
    request.send(null)
    var toursteps = JSON.parse(request.responseText);

    createTour('simple', toursteps)
}