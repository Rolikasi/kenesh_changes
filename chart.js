d3.csv("data/deputs_js.csv")
  .then(function (data) {
    var main = d3.select("main");
    var scrolly = main.select("#scrolly");
    var figure = scrolly.select("figure");
    var article = scrolly.select("article");
    var step = article.selectAll(".step");
    const parties = [...new Set(data.map((d) => d.party))].sort(
      (a, b) => a - b
    );
    console.log(parties)
    var maxDepNum = Math.max(...data.map((d) => parseInt(d.num, 10)));
    const uniqueSozyv = [...new Set(data.map((item) => item.sozyv))].sort(
      (a, b) => a - b
    );
    var myColor = d3
      .scaleOrdinal()
      .domain(parties)
      .range([
        "#00965E",
        "#8C4799",
        "#776E64",
        "#D12430", //red
        "#007DBA", // blue
        "#FFC72C", // yellow
        "darkgreen",
        "pink",
        "brown",
        "slateblue",
        "grey1",
        "#FFC72C",
      ]);
    var margin = {
      top: 25,
      right: 10,
      bottom: 30,
      left: 10,
    };
    function DrawChart(step) {
      width = window.innerWidth - margin.left - margin.right;
      height = window.innerHeight - window.innerHeight / 10;
      rectWidth = 7;
      rectPad = 10;
      rectBtwn = rectPad - rectWidth;
      rectsInRow = Math.floor(width / (rectWidth + rectBtwn));
      rectsInCol = Math.ceil(maxDepNum / rectsInRow);

      var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      console.log(data);
      const opacityHandler = (d) => {
        if (step == 1 & d.partyChanger == '1'){
          return '1'
        }
        else if (step == 1 & d.partyChanger == '0'){
          return '0.1'
        }
        else if (step == 2 & (d.sozyvChange > 1 | d.sozyvMisser > 1)){
          return '1'
        }
        else if (step == 2 & (d.sozyvChange < 2 | d.sozyvMisser < 2)){
          return '0.1'
        }
        else if (step == 3 & d.party == 'СДПК'){
          return '1'
        }
        else if (step == 3 & d.party != 'СДПК'){
          return '0.1'
        }
        else {
          return '1'
        }

      }

      const lookup = data.reduce((a, e) => {
        a[e.name] = ++a[e.name] || 0;
        return a;
      }, {});

      connectNames = data.filter((e) => lookup[e.name]);
      let depsLines = connectNames.reduce((r, a) => {
        r[a.name] = [...(r[a.name] || []), a];
        return r;
      }, {});
      depsLines = Object.values(depsLines).map((d) =>
        d.sort((a, b) => a.y - b.y)
      );
      console.log('depslines:', depsLines);
      // Y axis
      var y = d3.scaleBand().range([0, height]).domain(uniqueSozyv).padding(1);
      svg
        .append("g")
        .attr("stroke-width", 0)
        .call(d3.axisRight(y))
        .selectAll("text")
        .attr("transform", "rotate(-90)");

      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function (d) {
          curCol = Math.floor(parseInt(d.num, 10) / rectsInCol);
          curRow = Math.floor(d.num - rectsInCol * curCol);
          d.y = y(d.sozyv) + curRow * rectPad;
          d.curRow = curRow;
          return y(d.sozyv) + curRow * rectPad;
        })
        .attr("x", function (d) {
          curCol = Math.floor(parseInt(d.num, 10) / rectsInCol);
          d.x = curCol * rectPad;
          return curCol * rectPad;
        })
        .attr("width", rectWidth)
        .attr("height", rectWidth)
        .attr("fill", (d) => myColor(d.party))
        .attr('opacity', d => opacityHandler(d));


      let links = [];

      depsLines.map((d) => {
        links.push({
          party: d[1].party,
          sozyvChange: d[1].sozyv - d[0].sozyv,
          partyChanger: d[0].partyChanger,
          source: {
            x: d[0].x + rectWidth / 2,
            y: d[0].y + rectWidth,
            curRow: d[0].curRow,
          },
          target: { x: d[1].x + rectWidth / 2, y: d[1].y, curRow: d[1].curRow },
        });
      });
      depsLines
        .filter((e) => e.length > 2)
        .map((d) => {
          links.push({
            party: d[2].party,
            sozyvChange: d[2].sozyv - d[1].sozyv,
            partyChanger: d[1].partyChanger,
            source: {
              x: d[1].x + rectWidth / 2,
              y: d[1].y + rectWidth,
              curRow: d[1].curRow,
            },
            target: {
              x: d[2].x + rectWidth / 2,
              y: d[2].y,
              curRow: d[2].curRow,
            },
          });
        });

      console.log(links);
      // Append the links to the svg element
      var linkVertical = d3
        .linkVertical()
        .x(function (d) {
          return d.x;
        })
        .y(function (d) {
          return d.y;
        });

      svg
        .selectAll(".lines")
        .data(links)
        .enter()
        .append("path")
        .attr("d", (d) => {
          //console.log(d);
          if (d.sozyvChange > 1) {
              var x0 = d.source.x;
              var y0 = d.source.y;
              var x1 = d.target.x;
              var y1 = d.target.y;
              var startRow = d.source.curRow;
              var endRow = d.target.curRow;
              var ycontrol1 = y1 * (1 / d.sozyvChange) + y0 * (1 / d.sozyvChange);
              var ycontrol2 = y1 * (1 -(1 / d.sozyvChange)) + y0 * (1 - (1 / d.sozyvChange));
              return [
                "M",
                x0,
                y0,
                "L",
                x0,
                y0 + (rectsInCol - startRow) * rectPad,
                "C",
                width,
                ycontrol1,
                width,
                ycontrol2,
                x1,
                y1 - (endRow + 1) * rectPad,
                "L",
                x1,
                y1,
              ].join(" ");
          }
          else {
            return linkVertical(d);
          }
        })
        .attr("stroke", (d) => myColor(d.party))
        .attr("opacity", d => opacityHandler(d))
        .attr("fill", "none");
    }
    var scroller = scrollama();

    function handleResize() {
      // 1. update height of step elements
      console.log("resized");
      var stepH = Math.floor(window.innerHeight * 0.2);
      step.style("height", stepH + "px");

      var figureHeight = window.innerHeight / 2;
      var figureMarginTop = (window.innerHeight - figureHeight) / 2;

      figure
        .style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

      // 3. tell scrollama to update new element dimensions
      scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
      // response = { element, direction, index }
      console.log(response.index);
      var svg = d3.select("#chart svg");
      //d3.selectAll("g > *").remove()
      DrawChart(response.index);
      svg ? svg.remove() : null;

      // add to color to current step
      response.element.classList.add("is-active");
    }

    function handleStepExit(response) {
      // response = { element, direction, index }
      console.log(response);
      // remove color from current step
      response.element.classList.remove("is-active");
    }

    function init() {
      handleResize();
      // find the halfway point of the initial viewport height
      // (it changes on mobile, but by just using the initial value
      // you remove jumpiness on scroll direction change)
      var midpoint = Math.floor(window.innerHeight * 0.5) + "px";
      // 1. setup the scroller with the bare-bones options
      // 		this will also initialize trigger observations
      // 2. bind scrollama event handlers (this can be chained like below)
      scroller
        .setup({
          step: "#scrolly article .step",
          debug: false,
          offset: midpoint,
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

      // 3. setup resize event
      window.addEventListener("resize", handleResize);
    }

    // kick things off
    init();
  })

  .catch(function (error) {
    console.log(error); // handle error
  });
