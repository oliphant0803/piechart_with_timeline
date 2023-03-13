function startGuide(){
    var request = new XMLHttpRequest();
    request.open("GET", "toursteps.json", false);
    request.send(null)
    var toursteps = JSON.parse(request.responseText);

    createTour('simple', toursteps)
}