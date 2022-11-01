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
        return element !== undefined && element !== '' &&  element !== '';
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
    return titles;
}

myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        //console.log(JSON.stringify(data));
        
        //cleanup dom
        document.getElementById('dataBlock').innerHTML = '';
        var table = document.createElement('table');
        table.setAttribute("id", "datatables");
        document.getElementById('dataBlock').appendChild(table);

        create_table(JSON.stringify(data));
        read_data(JSON.stringify(data));
        const datatablesSimple = document.getElementById('datatables');
        if (datatablesSimple) {
            new simpleDatatables.DataTable(datatablesSimple);
        }
    };
    
    reader.readAsText(input);
});
