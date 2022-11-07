var cat_title;

function create_table(data){
    var keys = Object.keys(data[0]);
    console.log(keys);
    cat_title = keys[2];
    console.log(cat_title);
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
            th.innerHTML = data[i][key];

            row.appendChild(th);
        });

        body.appendChild(row);
    }

    table.appendChild(body);

}
