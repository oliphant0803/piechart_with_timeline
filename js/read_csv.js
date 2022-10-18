//example return value
//[
//     {"Year":"2007","price":"525000","bedrooms":"4"},
//     {"Year":"2007","price":"290000","bedrooms":"3"},
//     {"Year":"2007","price":"328000","bedrooms":"3"},
//     {"Year":"2007","price":"380000","bedrooms":"4"},
//     {"Year":"2007","price":"310000","bedrooms":"3"},
//     {"Year":"2007","price":"465000","bedrooms":"4"},
//     {"Year":"2007","price":"399000","bedrooms":"3"},
//     {"Year":"2007","price":"1530000","bedrooms":"4"},
//     {"Year":"2007","price":"359000","bedrooms":"3"},
//     {"Year":"2007","price":"320000","bedrooms":"3"},
//     {"Year":"2008","price":"1035000","bedrooms":"4"}
// ]

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

myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        //console.log(JSON.stringify(data));
        read_data(JSON.stringify(data));
    };
    
    reader.readAsText(input);
});