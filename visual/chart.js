d3.csv("data/deputs_js.csv")
  .then(function (data) {
    const bodySel = d3.select("body");
    var main = d3.select("main");
    var scrolly = main.select("#scrolly");
    var figure = scrolly.select("figure");
    var article = scrolly.select("article");
    var step = article.selectAll(".step");
    var laststep = article.select(".step--last");
    var selectedParty = null;
    var curResponse;
    var curStep = -1;
    var selectedDep = "";
    let previousWidth = bodySel.node().offsetWidth;
    const parties = [...new Set(data.map((d) => d.party))]
      .sort()
      .reverse()
      .sort(function (a, b) {
        return b.length - a.length;
      });
    console.log(parties);
    var maxDepNum = Math.max(...data.map((d) => parseInt(d.num, 10)));
    const uniqueSozyv = [...new Set(data.map((item) => item.sozyv))].sort(
      (a, b) => a - b
    );
    const uniqueDeps = [...new Set(data.map((item) => item.name))].sort(
      (a, b) => a - b
    );
    var myColor = d3.scaleOrdinal().domain(parties).range([
      "#FFC72C", //mainyellow
      "#5E2A01", //darkrfeorange
      "#EDA7AC", //mainpurple
      "#A4D65E", //darklime
      "#00965E", // maingreen
      "#BDC2C6", //lightrfeorange
      "#F7C39A",
      '#00acc5', //lightrfegray
      "#D12430", //mainred
      "#5B6770", // rfegray
      '#8C4799', //mainbrown
      '#BA91C2', //lightpurple
      "#2F1501", //blackrfeorange
      "#EA6903", //rfeorange
      '#665012', //lightred
      "#007DBA", // mainblue
    ]);
    var topMissers = [62, 72, 468];
    var margin = {
      top: 25,
      right: 10,
      bottom: 0,
      left: 30,
    };
    maxWidth = 700;
    year = ['95', '00', '05', '07', '10', '15']
    d3.select('#chart').style('opacity', 0.1).style('pointer-events', 'none');
    function DrawChart(step, callback) {
      width =
        d3.min([window.innerWidth, maxWidth]) - margin.left - margin.right;
      height = window.innerHeight - window.innerHeight / 10;
      rectWidth = 7;
      rectPad = 10;
      rectBtwn = rectPad - rectWidth;
      rectsInRow = Math.floor(width / (rectWidth + rectBtwn));
      rectsInCol = Math.ceil(maxDepNum / rectsInRow);
      main
        .select("#end")
        .style("max-width", maxWidth + "px")
        .style("margin", "auto");
      outro = main
        .select("#outro")
        .style("max-width", maxWidth + "px")
        .style("margin", "auto")
        .append("input")
        .attr("list", "depsList")
        .attr("height", rectWidth * 2)
        .attr("width", width / 2)
        .attr("name", "submit")
        .attr("type", "text")
        .attr("placeholder", "Введите имя депутата")
        .attr("value", () => (selectedDep != "" ? selectedDep : ""))
        .on("input", (d) => {
          selectedDep = main.select("input").property("value");
          if (uniqueDeps.includes(selectedDep)) {
            handleStepEnter(curResponse);
          }
        });
      dataList = outro.append("datalist").attr("id", "depsList");

      dataList
        .selectAll("option")
        .data(uniqueDeps)
        .enter()
        .append("option")
        .attr("value", (d) => d);
      var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // Y axis
      var y = d3.scalePoint().domain(uniqueSozyv).range([0 + height / 20, height - height / 7]);

      data.map(d => {
        curCol = Math.floor(parseInt(d.num, 10) / rectsInCol);
        curRow = Math.floor(d.num - rectsInCol * curCol);
        d.y = y(d.sozyv) + curRow * rectPad;
        d.curRow = curRow;
        d.x = curCol * rectPad;
        })
      console.log(data);
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
      console.log("depslines:", depsLines);

      svg
        .append("g")
        .on('click', () => d3.event.stopPropagation())
        .attr("stroke-width", 0)
        .call(
          d3
            .axisLeft(y)
            .tickValues(uniqueSozyv)
            .tickFormat((d, k) => d + " созыв '" + year[k])
        )
        .attr(
          "transform",
          () =>
            "translate( -" +
            rectWidth.toString() +
            " ," +
            rectsInCol * (rectWidth + 2) +
            ')'
        )
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "start");




      let links = [];

      depsLines.map((d) => {
        for (var i = 1; i < d.length; i++) {
          links.push({
            isDvijAtajurt: d[i].isDvijAtajurt,
            isPartyConstant: d[i].isPartyConstant,
            idname: d[i].idname,
            partyCount: d[i].partyCount,
            name: d[i].name,
            isAkjol: d[i].isAkjol,
            isArnamys: d[i].isArnamys,
            isAtajurt: d[i].isAtajurt,
            isAtameken: d[i].isAtameken,
            isBirbol: d[i].isBirbol,
            isCommunist: d[i].isCommunist,
            isIndependent: d[i].isIndependent,
            isKyrgyzstan: d[i].isKyrgyzstan,
            isOnuguu: d[i].isOnuguu,
            isRepAtajurt: d[i].isRepAtajurt,
            isRepublic: d[i].isRepublic,
            isFemale: d[i].isFemale,
            isSDPK: d[i].isSDPK,
            isAlga: d[i].isAlga,
            isAdilet: d[i].isAdilet,
            isOther: d[i].isOther,
            //isNewsila: d[i].isNewsila,
            isNodata: d[i].isNodata,
            party: d[i].party,
            sozyvChange: d[i].sozyv - d[i - 1].sozyv,
            sozyvMisser: d[i].sozyvMisser,
            partyChanger: d[i - 1].partyChanger,
            x: d[i].x,
            y: d[i].y,
            allParties: d[i].allParties,
            source: {
              x: d[i - 1].x + rectWidth / 2,
              y: d[i - 1].y + rectWidth,
              curRow: d[i - 1].curRow,
            },
            target: {
              x: d[i].x + rectWidth / 2,
              y: d[i].y,
              curRow: d[i].curRow,
            },
          });
        }
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
        tooltip ? tooltip.remove() : null;
        var tooltip = d3
          .select("#chart")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip");

        // Three function that change the tooltip when user hover / move / leave a cell

        var mouseover = function (d) {

          tooltip.style("opacity", 1);
          d3.selectAll('.id-' + d.idname).classed('depselected', true);
          d3.selectAll(".lines-id-" + d.idname).raise().classed('depselected',true);
        };
        var mousemove = function (d) {
          Object.filter = (obj, predicate) =>
            Object.keys(obj)
              .filter((key) => predicate(obj[key]))
              .reduce((res, key) => ((res[key] = obj[key]), res), {});

          curParties = d.allParties.split(",");
          curParties = Object.assign(
            ...curParties.map((k, i) => ({ [i + 1 + " созыв:"]: k }))
          );
          var filtered = Object.filter(curParties, (party) => party != "");

          tooltip
            .html(
              "<p class='tooltip--name'>" +
                d.name +
                "</p>" +
                Object.entries(filtered).map(
                  ([k, v]) => "<p class='tooltip--text'>" + `${k} ${v}`
                ) +
                "</p>"
            )
            .style("left", d.x + "px")
            .style("top", d.y + "px");
        };
        var mouseleave = function (d) {
          tooltip.style("opacity", 0);
          d3.selectAll('.id-' + d.idname).classed('depselected', false);
          d3.selectAll('.lines-id-' + d.idname).lower().classed('depselected', false);
        };

        const handleLegendClick = (d) => {
          selectedParty = d.party ? d.party : d;
          selectedDep = '';
          UpdateChart(curResponse.index, svg);
          d3.event.stopPropagation();
        };
        const handleDepClick = (d) => {
          selectedDep = d.name;
          UpdateChart(curResponse.index, svg);
        };
        const handleSvgClick = (d) => {
          selectedDep = '';
          UpdateChart(curResponse.index, svg);
        }

      svg
        .selectAll(".lines")
        .data(links)
        .enter()
        .append("path")
        .attr("class", (d) => "lines " + "lines-id-" + d.idname)
        .attr('opacity', '0.1')
        .attr("d", (d) => {
          if (d.sozyvChange > 1) {
            var x0 = d.source.x;
            var y0 = d.source.y;
            var x1 = d.target.x;
            var y1 = d.target.y;
            var startRow = d.source.curRow;
            var endRow = d.target.curRow;
            var ycontrol1 = y1 * (1 / d.sozyvChange) + y0 * (1 / d.sozyvChange);
            var ycontrol2 =
              y1 * (1 - 1 / d.sozyvChange) + y0 * (1 - 1 / d.sozyvChange);
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
          } else {
            return linkVertical(d);
          }
        })
        .attr("stroke", (d) => myColor(d.party))
        .attr("fill", "none")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave).on("click", (d) => {handleDepClick(d)
          d3.event.stopPropagation();} );

        svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", (d) => "chartrect " + "id-" + d.idname)
        .attr("y", function (d) {
          return d.y;
        })
        .attr("x", function (d) {
          return d.x;
        })
        .attr("width", rectWidth)
        .attr("height", rectWidth)
        .attr("stroke", (d) => myColor(d.party))
        .attr("stroke-width", "1")
        .attr("fill", (d) => myColor(d.party))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", (d) => {handleDepClick(d);
          d3.event.stopPropagation();});

          d3.select('#chart').on('click', d => handleSvgClick(d))
      var legend = svg
        .selectAll(".legend")
        .data(parties)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          var heightLegend = rectWidth + rectPad + 3;
          var horz = width - rectBtwn;
          var vert = i * heightLegend - rectPad;
          return "translate(" + horz + "," + vert + ")";
        });

      legend
        .append("rect")
        .attr("height", rectWidth)
        .attr("width", rectWidth)
        .attr("fill", (d) => myColor(d));
      legend
        .append("text")
        .attr("font-weight", "100")
        .attr("text-anchor", "end")
        .attr("x", 0 - rectBtwn)
        .attr("y", rectWidth)
        .text((d) => d);
      legend.on("click", (d) => {handleLegendClick(d)});

      callback();
    }

    function UpdateChart(step, svg) {
     //console.log('selectedDep', selectedDep)
      if (selectedDep != ''){
        null
      } else {
        d3.select('.tooltip').style('opacity', 0);
        d3.selectAll('.depselected').classed('depselected', false)
      }
      const opacityHandler = (d) => {
        if (selectedDep != "") {
          return d.name == selectedDep ? "1" : "0.1";
        }
        else if (step == 0) {
          return "1";
        } else if ((step == 1) & (d.sozyv == "3")) {
          return "1";
        } else if ((step == 2) & (d.sozyvMisser == "")) {
          return "1";
        } else if ((step == 3) & (d.partyChanger == "1")) {
          return "1";
        } else if ((step == 4) & (d.isPartyConstant == "1")) {
          topMissers.map(e => {
            d3.select('.id-' + e).style("stroke-width", "1");
            d3.select(".lines-id-" + e).style("stroke-width", "1").lower()
          })
          return "1";
        } else if ((step == 5) & (d.sozyvMisser > 1) ) {
          topMissers.map(e => {
            d3.select('.id-' + e).style("stroke-width", "3");
            d3.select(".lines-id-" + e).style("stroke-width", "3").raise()
          })
          return "1";
        } else if ((step == 6) & (d.isFemale == "1")) {
          topMissers.map(e => {
            d3.select('.id-' + e).style("stroke-width", "1");
            d3.select(".lines-id-" + e).style("stroke-width", "1").lower()
          })
          return "1";
        } else if ((step == 7) & (d.partyCount > 2)) {
          return "1";
        } else if ((step == 8) & (d.partyCount > 4)) {
          return "1";
        } else if ((step == 9) & (selectedDep == "")) {
          switch (selectedParty) {
            case "СДПК":
              return d.isSDPK == "1" ? "1" : "0.1";
            case "Республика - Ата Журт":
              return d.isRepAtajurt == "1" ? "1" : "0.1";
            case "Бир Бол":
              return d.isBirbol == "1" ? "1" : "0.1";
            case "Ата-Журт":
              return d.isAtajurt == "1" ? "1" : "0.1";
            case "Ак Жол":
              return d.isAkjol == "1" ? "1" : "0.1";
            case "Онугуу-Прогресс":
              return d.isOnuguu == "1" ? "1" : "0.1";
            case "Ар-Намыс":
              return d.isArnamys == "1" ? "1" : "0.1";
            case "Партия коммунистов":
              return d.isCommunist == "1" ? "1" : "0.1";
            case "Республика":
              return d.isRepublic == "1" ? "1" : "0.1";
            case "Кыргызстан":
              return d.isKyrgyzstan == "1" ? "1" : "0.1";
            case "Самовыдвиженцы":
              return d.isIndependent == "1" ? "1" : "0.1";
            case "Ата Мекен":
              return d.isAtameken == "1" ? "1" : "0.1";
            case "Адилет":
              return d.isAdilet == "1" ? "1" : "0.1";
            case "другое":
              return d.isOther== "1" ? "1" : "0.1";
            case "Нет данных":
              return d.isNodata == "1" ? "1" : "0.1";
            case "Алга Кыргызстан":
              return d.isAlga == "1" ? "1" : "0.1";
            case "Движение Ата-Журт":
              return d.isDvijAtajurt == "1" ? "1" : "0.1";

            default:
              return "0.1";
          }
        } else {
          return "0.1";
        }
      };


      const handleLegendFont = (d) => {
        if ((d == selectedParty) & (step == 9) & (selectedDep == "")) {
          return "900";
        } else {
          return "100";
        }
      };

      d3.select('#outro input')
      .attr("value", () => (selectedDep != "" ? selectedDep : ""))

      svg
        .selectAll(".chartrect")
        .transition()
        .delay(function(d,i){ return i; })
        .attr("opacity", (d) => opacityHandler(d));
      svg
        .selectAll(".lines")
        .transition()
        .delay(function(d,i){ return i; })
        .attr("opacity", (d) => opacityHandler(d));

      svg
        .selectAll(".legend")
        .selectAll("text")
        .attr("font-weight", (d) => handleLegendFont(d));
    }

    var scroller = scrollama();

    function handleResize() {
      window.mobileCheck = function () {
        let check = false;
        (function (a) {
          if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
              a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
              a.substr(0, 4)
            )
          )
            check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
      };
      const resizeHeight = () => {
        var stepH = Math.floor(window.innerHeight * 0.75);
        step.style("height", stepH + "px");
        laststep.style("height", window.innerHeight * 1.2 + "px");
        var figureHeight = window.innerHeight;
        var figureMarginTop = (window.innerHeight - figureHeight) / 2;

        figure
          .style("height", figureHeight + "px")
          .style("top", figureMarginTop + "px");
      };
      const width = bodySel.node().offsetWidth;
      var svg = d3.select("#chart svg");
      var input = d3.select("#outro input");
      var tooltip = d3.select(".tooltip");
      if (previousWidth !== width) {
        previousWidth = width;
        tooltip.remove();
        input.remove();
        svg.remove();
        DrawChart(curResponse, function () {
          svg = d3.select("#chart svg");
          curResponse
            ? UpdateChart(curResponse.index, svg)
            : UpdateChart(curStep, svg);
        });
        resizeHeight();
      }

      // 1. update height of step elements
      if (!window.mobileCheck() || window.mobileCheck() & (curStep == -1)) {
        resizeHeight();
      }

      // 3. tell scrollama to update new element dimensions
      scroller.resize();
    }
    // scrollama event handlers
    function handleStepEnter(response) {
      selectedParty = '';
      selectedDep = '';
      //console.log('enter')
      if (response.index == 0) {
        d3.select('#intro').style('pointer-events', 'none').transition().duration(600).style('opacity', 0);
        d3.select('#chart').style('pointer-events', 'auto').transition().duration(600).style('opacity', 1);
      }
      // response = { element, direction, index }
      var svg = d3.select("#chart svg");
      if (response) {
        curResponse = response;
        curStep = response.index;
        if (svg.empty()) {
          DrawChart(response.index, function () {
            UpdateChart(response.index, svg);
          });
        } else {
          UpdateChart(response.index, svg);
        }
      }


      // add to color to current step
      //response.element.classList.add("is-active");
    }

    function handleStepExit(response) {
      //console.log('Exit')
      selectedParty = '';
      selectedDep = '';
      if (response.index == 0 & response.direction == 'up') {
        d3.select('#intro').style('pointer-events', 'auto').transition().duration(600).style('opacity', 1);
        d3.select('#chart').style('pointer-events', 'none').transition().duration(600).style('opacity', 0.1);
      }
      // response = { element, direction, index }
      // remove color from current step
      //response.element.classList.remove("is-active");
    }
    function setupStickyfill() {
      d3.selectAll(".sticky").each(function () {
        Stickyfill.add(this);
      });
    }
    function init() {
      setupStickyfill();
      handleResize();
      DrawChart(0, (d) => {});
      // find the halfway point of the initial viewport height
      // (it changes on mobile, but by just using the initial value
      // you remove jumpiness on scroll direction change)
      var midpoint = Math.floor(window.innerHeight * 0.75) + "px";
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

      function debounce(func, wait, immediate) {
        var timeout;
        return function () {
          var context = this,
            args = arguments;
          var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      }
      var efficientResize = debounce(function () {
        handleResize(); // All the taxing stuff you do
      }, 250);

      // 3. setup resize event
      window.addEventListener("resize", efficientResize);
    }

    // kick things off
    init();
  })

  .catch(function (error) {
    console.log(error); // handle error
  });
