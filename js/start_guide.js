function startGuide(){
    var request = new XMLHttpRequest();
    request.open("GET", "https://oliphant0803.github.io/piechart_with_timeline/toursteps.json", false);
    request.send(null)
    var toursteps = JSON.parse(request.responseText);

    createTour('simple', toursteps);

    //change button from disabled to enabled
    //id: step-5-description: shepherd-button-primary
    //id: step-6-description
    //id: step-7-description
}