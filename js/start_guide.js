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

waitForElm('[data-shepherd-step-id="step-5"]').then((elm) => {
    enableClick('[data-shepherd-step-id="step-5"]');
});

waitForElm('[data-shepherd-step-id="step-6"]').then((elm) => {
    enableDblClick('[data-shepherd-step-id="step-6"]');
});

waitForElm('[data-shepherd-step-id="step-7"]').then((elm) => {
    enableClick('[data-shepherd-step-id="step-7"]');
});

