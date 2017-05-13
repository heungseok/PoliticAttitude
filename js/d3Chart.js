/**
 * Created by heungseok2 on 2017-05-14.
 */


function createD3chart(container_name) {

    var svg;

    // Set the dimensions of the canvas / graph
    var margin = {top: 20, right: 60, bottom: 10, left: 60},
        width = window.innerWidth / 3,
        height = window.innerHeight / 20;

    var chart_title = "-----";
    var chart_status = "";

    // var parseDate = d3.timeParse("%b %Y"); // valid for yyyy-mm-dd format
    var parseDate = d3.timeParse("%Y-%m-%d %H:%M"); // valid for yyyy-mm-dd hh:mm format

    var x,y,z,
        line,
        xAxis, yAxis;

    var time_period = ["0318", "0325", "0401", "0408"];


    return {
        init: init,
        updateData: updateData

    };

    function init() {

        window.onload = function () {
            var d = document.getElementById(container_name);
            d.style.width = 20 + 'vw';
            d.style.height = 5 + 'vh';
            // d.style.position = "absolute";
            // d.style.left = 10 + 'px';
            // d.style.top = 800 + 'px';
            // initialize d3 chart (overall)
            // initD3();
            drawTimePeriod();
        };

    }

    function drawTimePeriod(){

        // Adds the svg canvas
        svg = d3.select('#' + container_name)
            .append("svg")
            .attr("width",width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 100)
            // .style("display", "block")
            // .attr("height", height + margin.top + margin.bottom + 100)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top+ ")");
        // .attr("transform", "translate(" + margin.left + "," + 100+ ")");

        // Add title of the chart
        svg.append("text")
            .attr("x", (width/2))
            // .attr("y", (margin.top / 2) - 20 )
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .attr("class", "chart-title")
            // .style("font-size", "20px")
            // .style("fill", "white")
            // .text(chart_title + chart_status);
            .text("Period of crawled data");


        // Set the ranges
        x = d3.scaleBand()
            .rangeRound([0, width]).padding(0.1);

        x.domain(time_period);


        // x = d3.scaleOrdinal()
        //     .domain(["0318 - 0324", "0325 - 0331", "0401 - 0407"])
        //     .range([0, width]);

        // define the axes
        // xAxis = d3.axisBottom().scale(x).ticks(5);
        // xAxis = d3.axisBottom().scale(x);
        xAxis = d3.axisBottom().scale(x);

        // Add the X Axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + -10 + ")")
            .call(xAxis);
        // transform: translate(x, y) => g element를 x,y 만큼 이동.


    }





    function initD3() {

        // Adds the svg canvas
        svg = d3.select('#' + container_name)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 100)
            .append("g")
            // .attr("transform", "translate(" + margin.left + "," + margin.top+ ")");
            .attr("transform", "translate(" + margin.left + "," + 100+ ")");

        // Add title of the chart
        svg.append("text")
            .attr("x", (width/2))
            // .attr("y", (margin.top / 2) - 20 )
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("class", "chart-title")
            .style("font-size", "20px")
            .style("fill", "white")
            .text(chart_title + chart_status);
        // .text("커뮤니티별 키워드 언급량 ");


        // Set the ranges
        x = d3.scaleTime().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);
        z = d3.scaleOrdinal(d3.schemeCategory10);

        // define the axes
        xAxis = d3.axisBottom().scale(x).ticks(5);
        yAxis = d3.axisLeft().scale(y).ticks(5);

        // define the line
        line = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.price); });

        // get the data
        d3.csv("./data/data.csv", function (error, data) {
            if(error) throw error;

            // format the data
            data.forEach(function (d) {
                // console.log(d);
                d.date = parseDate(d.date);
                d.price = +d.price;
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function (d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return d.price; })]);

            // Nest the entries by symbol(group)
            var dataNest = d3.nest()
                .key(function(d) {return d.symbol;})
                .entries(data);

            // set the colour scale
            var color = d3.scaleOrdinal(d3.schemeCategory10);

            var legendSpace = width/dataNest.length; // spacing for the legend

            // Loop through each symbol / key
            dataNest.forEach(function (d, i) {

                // add path
                svg.append("path")
                    .attr("class", "line")
                    .style("stroke", function () { // Add the colours dynamically
                        return d.color = color(d.key);
                    })
                    .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign an ID
                    .attr("d", line(d.values));

                // add the Legend
                svg.append("text")
                    .attr("x", (legendSpace/2) + i*legendSpace) // space legend
                    .attr("y",-30)
                    // .attr("y", height + (margin.bottom/2) + 5)
                    .attr("class", "lineChart_legend") // style the legend
                    .style("fill", function () {
                        return d.color = color(d.key);
                    })
                    .style("font-size", "20px")
                    .on("click", function(){
                        graph.two_steps_network(d.key);
                    })

                    // .on("click", function () {
                    //     // Determine if current line is visible
                    //     var active = d.active ? false : true,
                    //         newOpacity = active ? 0 : 1;
                    //     // Hide or show the elements based on the ID
                    //     d3.select('#tag' + d.key.replace(/\s+/g, ''))
                    //         .transition().duration(1000)
                    //         .style("opacity", newOpacity);
                    //     // Update whether or not the elements are active
                    //     d.active = active;
                    // })
                    .text(d.key);

            });

            // Add the X Axis
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
            // transform: translate(x, y) => g element를 x,y 만큼 이동.

            // Add the Y Axis
            svg.append("g")
                .attr("class", "y-axis")
                .call(yAxis);

        });


    }


    // function updateNetowrk(name) {
    //     console.log(name);
    //
    // }


    // update data section (called from the onclick on the specific node of networks)
    function updateData(node) {

        chart_status = "(" + node + ")";

        var svg = d3.select("#"+container_name);

        svg.select(".chart-title")
            .transition().duration(1000)
            .text(chart_title + chart_status);

        // Get the data again
        d3.csv("./data/data-alt.csv", function (error, data) {
            data.forEach(function (d) {
                d.date = parseDate(d.date);
                d.price = + d.price;
            });

            // Nest the entries by symbol(group)
            var dataNest = d3.nest()
                .key(function(d) {return d.symbol;})
                .entries(data);

            // set the colour scale

            // Scale the range of the data again
            x.domain(d3.extent(data, function (d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return d.price; })]);

            // Select the section we want to apply our changes to
            var svg = d3.select("#"+container_name);

            // Loop through each symbol / key
            dataNest.forEach(function (d, i) {

                // make the changes
                svg.select("#tag"+d.key.replace(/\s+/g, '')) // select by the key(group)
                    .transition().duration(1000) // change the lines
                    .attr("d", line(d.values));
                svg.select(".x-axis")
                    .transition().duration(1000)
                    .call(xAxis);
                svg.select(".y-axis")
                    .transition().duration(1000)
                    .call(yAxis);


            });


        });

    }




}