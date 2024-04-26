
d3.csv("/static/data/Kaggle_TwitterUSAirlineSentiment.csv")
  .then(function(data) {


  // Initialize an object to store counts for each airline
  const counts = {};

  // Iterate through the data
  data.forEach(function(d) {
    // Extract airline and sentiment
    const airline = d.airline;
    const sentiment = d.airline_sentiment;

    // Initialize counts if not present
    if (!counts[airline]) {
      counts[airline] = {
        positive: 0,
        negative: 0
      };
    }

    // Increment counts based on sentiment
    if (sentiment === "positive") {
      counts[airline].positive++;
    } else if (sentiment === "negative") {
      counts[airline].negative++;
    }
  });

  console.log(counts)

    // Group data by airline and sentiment
    const nestedData = d3.nest()
        .key(d => d.airline)
        .rollup(function(values) {
            return {
                positive: d3.sum(values, d => d.airline_sentiment === "positive" ? 1 : 0),
                negative: d3.sum(values, d => d.airline_sentiment === "negative" ? 1 : 0),
                neutral: d3.sum(values, d => d.airline_sentiment === "neutral" ? 1 : 0)
            };
        })
        .entries(data);

    // Extract groups (airlines) and subgroups (sentiments)
    const groups = nestedData.map(d => d.key); // airline names
    const subgroups = ["positive", "negative", "neutral"];

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 20, left: 50};
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0));

// Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(nestedData, d => d3.max(subgroups, key => d.value[key]))])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));


    // Another scale for subgroup position
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#259804','#e41a1c', '#377eb8']);

// Show the bars
svg.selectAll(".barGroup")
    .data(nestedData)
    .enter()
    .append("g")
    .attr("class", "barGroup")
    .attr("transform", d => "translate(" + x(d.key) + ",0)")
    .selectAll("rect")
    .data(function(d) {
        return subgroups.map(function(key) {
            return { key: key, value: d.value[key] || 0 }; // Ensure value exists or default to 0
        });
    })
    .enter().append("rect")
    .attr("x", d => xSubgroup(d.key))
    .attr("y", d => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", d => color(d.key));
  })
  .catch(function(error) {
    // Handle any errors that occur during data loading
    console.error("Error loading data:", error);
  });

//Code for Pie Charts
const pie_width = 200
const pie_height = 200
const pie_margin = 20
const pie_radius = Math.min(pie_width, pie_height) / 2 - pie_margin

const pie1_svg = d3.select('#pie-chart1')
                    .append("svg")
                        .attr("width", pie_width)
                        .attr("height", pie_height)
                    .append('g')
                        .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")")

const test_data = {a: 9, b: 20, c:30, d:8, e:12}

const pie_colour = d3.scaleOrdinal()
                  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

// Compute the position of each group on the pie:
const pie1 = d3.pie()
  .value(function(d) {return d[1]})
const data_ready1 = pie1(Object.entries(test_data))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
pie1_svg
  .selectAll('whatever')
  .data(data_ready1)
  .join("path")
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(pie_radius)
  )
  .attr('fill', function(d){ return(pie_colour(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)