function startGuide(){
    var request = new XMLHttpRequest();
    request.open("GET", "https://oliphant0803.github.io/piechart_with_timeline/toursteps.json", false);
    request.send(null)
    var toursteps = JSON.parse(request.responseText);

    createTour('simple', toursteps)
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function enableClick(id) {
    let stepDiv = document.querySelector(id);
    var submitButton = document.getElementById('arc_1_2012');

    let buttonClicked = false;
    submitButton.addEventListener('click', function handleClick() {
        if (buttonClicked) {
            return;
        }

        buttonClicked = true;
        stepDiv.querySelector('.shepherd-button-primary').classList.remove('disabled-button');
        stepDiv.querySelector('.shepherd-button-primary').disabled = false;
    });
}

function enableDblClick(id) {
    let stepDiv = document.querySelector(id);
    var submitButton = document.getElementById('arc_1_2012');

    let buttonClicked = false;
    submitButton.addEventListener('dblclick', function handleClick() {
        if (buttonClicked) {
            return;
        }

        buttonClicked = true;
        stepDiv.querySelector('.shepherd-button-primary').classList.remove('disabled-button');
        stepDiv.querySelector('.shepherd-button-primary').disabled = false;
    });
}

function nextStep(tour) {
    tour.next();
    var step = tour.getCurrentStep();
    //if id is step 8
    //scroll down 50%
    if (step.options.id == 'step-8') {
        window.scrollBy(0, window.innerHeight / 2);
    }
    enableClick('[data-shepherd-step-id='+step.options.id+']');
}

function backStep(tour) {
    //return tour.back but with disabled:true make disabled:false
    tour.back();
    var step = tour.getCurrentStep();
    // if its step 5
    if (step.options.id == 'step-5') {
        tsp.setData(2007);
        tsp.setData(2007);
        tsp.prepareChart();
        tsp.prepareData();
        tsp.plotPie();
    } //else if its step 6
    else if (step.options.id == 'step-6') {
        tsp.setData(2012);
        tsp.setData(2012);
        tsp.prepareChart();
        tsp.prepareData();
        tsp.plotPie();
    } // else if its step 7 
    else if (step.options.id == 'step-7') {
        tsp.alignMode = true;
        tsp.align(tsp.piedata, 2012);
        tsp.updateChart();
        window.scrollBy(0, -window.innerHeight / 2);
    }
    step.options.buttons[1].disabled = false;
    step.options.buttons[1].classes = step.options.buttons[1].classes.replace(' disabled-button', '');
    step.updateStepOptions(step.options);
}

waitForElm('[data-shepherd-step-id="step-5"]').then((elm) => {
    enableClick('[data-shepherd-step-id="step-5"]');
    
});

waitForElm('[data-shepherd-step-id="step-6"]').then((elm) => {
    enableDblClick('[data-shepherd-step-id="step-6"]');
});

waitForElm('[data-shepherd-step-id="step-7"]').then((elm) => {
    enableClick('[data-shepherd-step-id="step-7"]');
    enableDblClick('[data-shepherd-step-id="step-6"]');
});

waitForElm('[data-shepherd-step-id="step-8"]').then((elm) => {
    window.scrollBy(0, window.innerHeight / 2);
});

