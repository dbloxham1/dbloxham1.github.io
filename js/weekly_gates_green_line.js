// Load the data from the CSV file
d3.csv('https://raw.githubusercontent.com/dbloxham1/cs416-dataviz-final/main/data/gated_entries_by_week_route.csv').then(data => {
    // Parse the date and convert gated_entries to number
    const parseTime = d3.timeParse('%Y-%m-%d');
    data = data.filter(d => d.route_short === 'Green').map(d => {
        d.firstDayOfWeek = parseTime(d.firstDayOfWeek);
        d.gated_entries = +d.gated_entries;
        return d;
    });

    const pointData = data.filter(d => d.firstDayOfWeek === '2022-03-21').map(d => {
        d.firstDayOfWeek = parseTime(d.firstDayOfWeek);
        d.gated_entries = +d.gated_entries;
    });

    // Set the dimensions and margins of the graph
    const margin = {top: 20, right: 75, bottom: 20, left: 75};
    const width = d3.select("svg").attr("width") - margin.left - margin.right;
    const height = d3.select("svg").attr("height") - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select('#green')
                  .append('svg')
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Define the scales
    const xScale = d3.scaleTime()
                     .domain(d3.extent(data, d => d.firstDayOfWeek))
                     .range([0, width]);
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.gated_entries)])
                     .range([height, 0]);
    
    var tooltip = d3.select('#tooltip');

    const line = d3.line()
        .x(d => xScale(d.firstDayOfWeek))
        .y(d => yScale(d.gated_entries));

    // Add the scatterplot points
    svg.selectAll()
        .data(data.filter(d => d.firstDayOfWeek.getTime() >= new Date('2022-03-20').getTime() && d.firstDayOfWeek.getTime() < new Date('2022-03-28').getTime()))
        .enter()
        .append('circle')
        .attr("cx", d => xScale(d.firstDayOfWeek))
        .attr("cy", d => yScale(d.gated_entries))
        .attr("r", 6)
        .style('fill','green')
        .on("mouseover",function(d){
            tooltip.style("opacity",1)
                .attr("transform","translate("+d.pageX+","+d.pageY+")")
                .style("left",(d.pageX)+"px")
                .style("top",(d.pageY)+"px")
                .html("Opening of Green Line Extension")
            ;
        })
        .on("mouseout",function(){tooltip.style("opacity",0)})
    ;
    
    svg.append('path')
        .style("stroke","green")
        .data([data])
        .attr('class', 'line')
        .attr('d', line);

    // Add the X Axis
    svg.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(xScale));

    // Add the Y Axis
    svg.append('g')
       .call(d3.axisLeft(yScale));

});
