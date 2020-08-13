d3.csv("data/deputs_js.csv")
  .then(function (data) {
    var margin = {
        top: 25,
        right: 10,
        bottom: 30,
        left: 10,
      },
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight - window.innerHeight / 10;
      rectWidth = 10
      rectPad = 15
      rectBtwn = rectPad - rectWidth
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    console.log(data);
    var x = d3.scaleLinear().domain([0, 150]).range([0, width]);

    // Y axis
    var y = d3
      .scaleBand()
      .range([0, height])
      .domain(['party_IV','party_V','party_VI'])
      .padding(1);
      svg.append("g")
      .call(d3.axisRight(y));

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", function (d) {
        rectsInRow = Math.floor(width / (rectWidth + rectBtwn))
        curRow = Math.floor(d.num  / rectsInRow) + 1
        return y(d.sozyv) + curRow * rectPad
      })
      .attr('x', function (d) {
        rectsInRow = Math.floor(width / (rectWidth + rectBtwn))
        curRow = Math.floor(d.num   / rectsInRow)
        console.log(d.num * curRow)
        return (d.num - (rectsInRow * curRow)) * rectPad
      })
      .attr('width', rectWidth)
      .attr('height', rectWidth);
  })
  .catch(function (error) {
    console.log(error)// handle error
  });
