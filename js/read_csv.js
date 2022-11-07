const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");

function csvToArray(str, delimiter = ",") {

    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
    }, {});
    return el;
    });

    return arr;
}


function get_rows(data){
    var key = Object.keys(data[0])[0];
    var rows = data.map( (value) => value[key]).filter( (value, index, _data) => _data.indexOf(value) == index);
    rows = rows.filter(function( element ) {
        return element !== undefined && element !== '' &&  element !== ' ';
    });
    return rows;
}

function get_stats(data){
    return [Object.keys(data[0])[0], Object.keys(data[0])[1], Object.keys(data[0])[2]];
}

function get_titles(data){
    var key = Object.keys(data[0])[2];
    var titles = data.map( (value) => value[key]).filter( (value, index, _data) => _data.indexOf(value) == index);
    titles = titles.filter(function( element ) {
        return element !== undefined && element !== '';
    });
    for(var i=0; i<titles.length; i++){
        titles[i] = titles[i].replace(/["]+/g, '')
    }
    return titles;
}

function clean_data(data, filterBy){
    var keys = Object.keys(data[0]);
    for(var i=0; i<data.length; i++){
        if(data[i][keys[0]] == undefined || data[i][keys[1]] == undefined || data[i][keys[2]] == undefined){
            data.splice(i, 1);
            continue;
        }
        data[i][keys[0]] = data[i][keys[0]].replace(/["]+/g, '')
        data[i][keys[1]] = data[i][keys[1]].replace(/["]+/g, '')
        data[i][keys[2]] = data[i][keys[2]].replace(/["]+/g, '')
        switch(filterBy){
            case "year":
                
                let date = new Date(data[i][keys[0]]);
                const timestamp = date.getTime();
                date = new Date(timestamp);
                data[i][keys[0]] = date.getFullYear();
                    
            
                break;
    
            case "month":
                break;
            case "day":
                break;
            case "hour":
                break;
            case "minute":
                break;
            case "second":
                break;
        }
        if(data[i][keys[0]] == ' ' || data[i][keys[1]] == ' ' || data[i][keys[2]] == ' ' ||
        data[i][keys[0]] == '' || data[i][keys[1]] == '' || data[i][keys[2]] == ''){
            data.splice(i, 1);
        }
    }
    return data;
}

myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        var data = csvToArray(text);
        //console.log(JSON.stringify(data));
        
        //cleanup dom
        document.getElementById('dataBlock').innerHTML = '';
        var table = document.createElement('table');
        table.setAttribute("id", "datatables");
        document.getElementById('dataBlock').appendChild(table);
        
        data = JSON.parse(JSON.stringify(data))
        data = clean_data(data, "year");
        create_table(data);
        read_data(data);
        const datatablesSimple = document.getElementById('datatables');
        if (datatablesSimple) {
            new simpleDatatables.DataTable(datatablesSimple);
        }
    };
    
    reader.readAsText(input);
});
