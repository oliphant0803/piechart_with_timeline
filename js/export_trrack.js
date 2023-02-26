function export_data(){
    var output = [];

    const provRecordDiv = document.getElementById("globalG"); 
    // if the number of child is n
    // start index is n/2
    var startIndex = Math.floor(provRecordDiv.childElementCount/2)+1;
    // 2nd g tag 
    var currElement = provRecordDiv.children.item(startIndex);
    while (currElement !=  null && currElement != undefined){
        output.push(get_curr_output(currElement));
        startIndex = startIndex + 1;
        currElement = provRecordDiv.children.item(startIndex);
    }
    // console.log(output);
    return output;
}

function get_curr_output(currElement){
    // 1st g tag

    var firstG = currElement.children.item(1).children.item(0);
    // 3rd element text
    var textTag = firstG.children.item(2);
    return textTag.textContent;
}