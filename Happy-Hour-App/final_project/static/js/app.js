// from data.js
var tableData = data;

var tbody = d3.select("tbody");

function createTable(data){
    // First, clear out existing data
    tbody.html("");
    data.forEach(dataRow => {
         console.table(dataRow);
         let row = tbody.append("tr");
                 
         console.table(Object.values(dataRow));
         Object.values(dataRow).forEach((val) => {
            let cell = row.append("td");
            cell.text(val);
            });
     });
}

//select the web user's input and the filter button
var dateInputText = d3.select("#datetime")
var button = d3.select("filter-btn")

//Event to search table
function searchTableDate(){
    // prevent the form from refreshing the page
    d3.event.preventDefault()
    
    var date = d3.select("#datetime").property("value");
    var city = d3.select("#city").property("value");
    var date = d3.select("#state").property("value");
    var shape = d3.select("#shape").property("value");
    var filterData = tableData;
    
    // Check to see if a date was entered and filter the data using that date
    if (date){
        filterData = filterData.filter((row) => row.datetime === date);
        
    }
    
    createTable(filterData);
}

d3.selectAll("#filter-btn").on("click", searchTableDate);

createTable(tableData);




//var dateInputText = d3.select("#datetime")
//var button = d3.select("filter-btn")

////Event to search table
//function searchTableDate(){
    // prevent the form from refreshing the page
  //  d3.event.preventDefault()
    
    //var date = d3.select("#datetime").property("value");
    //var city = d3.select("#city").property("value");
   // var date = d3.select("#state").property("value");
   // var shape = d3.select("#shape").property("value");
   // var filterData = tableData;
