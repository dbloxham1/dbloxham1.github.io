// Load the data from the CSV file
d3.csv('https://raw.githubusercontent.com/dbloxham1/cs416-dataviz-final/main/gated_entries_by_week_route.csv').then(data => {
    // Parse the date and convert gated_entries to number
    const parseTime = d3.timeParse('%Y-%m-%d');
    data = data.filter(d => d.route_short === 'Orange').map(d => {
        d.firstDayOfWeek = parseTime(d.firstDayOfWeek);
        d.gated_entries = +d.gated_entries;
        return d;
    });

    // Set the dimensions and margins of the graph
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select('#orange')
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

    const line = d3.line()
        .x(d => xScale(d.firstDayOfWeek))
        .y(d => yScale(d.gated_entries));

    // Add the scatterplot points
    

    svg.append('path')
        .style("stroke","orange")
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