window.addEventListener('DOMContentLoaded', event => {
    const datatablesSimple = document.getElementById('datatables');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
});

function create_table(data){
    data = JSON.parse(data);
    var keys = Object.keys(data[0]);
    console.log(keys);
    var table = document.getElementById('datatables');

    //create thead
    var head = document.createElement('thead');
    var row = document.createElement('tr');
    
    keys.forEach((key) => {
        var th = document.createElement('th');
        th.innerHTML = key;
        row.appendChild(th);
    });

    head.appendChild(row);
    table.appendChild(head);

    //create tfoot
    var foot = document.createElement('tfoot');
    var row = document.createElement('tr');
    
    keys.forEach((key) => {
        var th = document.createElement('th');
        th.innerHTML = key;
        row.appendChild(th);
    });

    foot.appendChild(row);
    table.appendChild(foot);

    //create tbody
    var body = document.createElement('tbody');
    
    for(var i=0; i<data.length; i++){
        var row = document.createElement('tr');
        
        keys.forEach((key) => {
            var th = document.createElement('th');
            
            //get the value

            row.appendChild(th);
        });

        body.appendChild(row);
    }

    table.appendChild(body);
}
