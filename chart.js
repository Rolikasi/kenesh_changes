d3.csv("data/deputs_js.csv")
  .then(function (data) {
    var parties = [...new Set(data.map((d) => d.party))];
    var maxDepNum = Math.max(...data.map((d) => parseInt(d.num, 10)));
    var myColor = d3
      .scaleOrdinal()
      .domain(parties)
      .range([
        "gold",
        "blue",
        "green",
        "yellow",
        "black",
        "grey",
        "darkgreen",
        "pink",
        "brown",
        "slateblue",
        "grey1",
        "orange",
      ]);
    var margin = {
        top: 25,
        right: 10,
        bottom: 30,
        left: 10,
      },
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight - window.innerHeight / 10;
    rectWidth = 7;
    rectPad = 10;
    rectBtwn = rectPad - rectWidth;
    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    console.log(data);
    var x = d3.scaleLinear().domain([0, 150]).range([0, width]);

    // Y axis
    var y = d3
      .scaleBand()
      .range([0, height])
      .domain(["party_III", "party_IV", "party_V", "party_VI"])
      .padding(1);
    svg.append("g").call(d3.axisRight(y));

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", function (d) {
        rectsInRow = Math.floor(width / (rectWidth + rectBtwn));
        rectsInCol = Math.ceil(maxDepNum / rectsInRow);
        curCol = Math.floor(parseInt(d.num, 10) / rectsInCol);
        curRow = Math.floor(d.num - rectsInCol * curCol);
        d.y = y(d.sozyv) + curRow * rectPad;
        return y(d.sozyv) + curRow * rectPad;
      })
      .attr("x", function (d) {
        rectsInRow = Math.floor(width / (rectWidth + rectBtwn));
        rectsInCol = Math.ceil(maxDepNum / rectsInRow);
        curCol = Math.floor(parseInt(d.num, 10) / rectsInCol);
        d.x = curCol * rectPad;
        return curCol * rectPad;
      })
      .attr("width", rectWidth)
      .attr("height", rectWidth)
      .attr("fill", (d) => myColor(d.party));

    const lookup = data.reduce((a, e) => {
      a[e.name] = ++a[e.name] || 0;
      return a;
    }, {});

    connectNames = data.filter((e) => lookup[e.name]);
    let depsLines = connectNames.reduce((r, a) => {
      r[a.name] = [...(r[a.name] || []), a];
      return r;
    }, {});
    depsLines = Object.values(depsLines).map((d) => d.sort((a, b) => a.y - b.y));

    console.log(depsLines);
    let links = [];
    depsLines.map((d) => {
      links.push(
        { party: d[1].party,
          source: [d[0].x + rectWidth / 2, d[0].y + rectWidth],
          target: [d[1].x + rectWidth / 2, d[1].y],
        }
      );
    });
    depsLines
      .filter((e) => e.length > 2)
      .map((d) => {
        links.push(
          { party: d[2].party,
            source: [d[1].x + rectWidth / 2, d[1].y + rectWidth],
            target: [d[2].x + rectWidth / 2, d[2].y],
          }
        );
      });

    console.log(links);
    // Append the links to the svg element
    var linkVertical = d3
      .linkVertical()
      .x(function (d) {
        return d[0];
      })
      .y(function (d) {
        return d[1];
      });

    svg
      .selectAll(".lines")
      .data(links)
      .enter()
      .append("path")
      .attr("d", d => {console.log(linkVertical(d)); return linkVertical(d);})
      .attr("stroke", d => myColor(d.party))
      .attr('opacity', '0.3')
      .attr("fill", "none");
  })
  .catch(function (error) {
    console.log(error); // handle error
  });
