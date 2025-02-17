import * as d3 from "d3";

/**
 * Creates a Bundestag seat plot using D3.js
 * @param {Object} config - Configuration object
 * @param {number} config.width - SVG width
 * @param {number} config.height - SVG height
 * @param {number} config.radius - Controls overall circle size
 * @param {number} config.rows - User-defined number of rows
 * @param {number} config.angleStart - Start angle of the plot
 * @param {number} config.angleEnd - End angle of the plot
 * @param {number} config.seatFactor - shrinks seat radius
 * @param {number} config.circleHeightAdjuster - shrinks seat radius
 * @param {Array} config.peopleData - Array of party data [{party: "SPD", count: 206, color: "red"}]
 * @returns {SVGElement} - Returns an SVG element
 */


export function BundestagChart({
    width = 800,
    height = 600,
    radius = 250,
    rows = 6,
    angleStart = Math.PI * 0.9,
    angleEnd = Math.PI * 2.1,
    partyGap = 0.02, // 🔹 Default gap between sections
    seatFactor = 3,
    circleHeightAdjuster=2,
    partiesData = [],
    peopleData = [] // 🔹 New: Data about people occupying seats
  } = {}) {
    const sectionGap = partyGap * Math.PI; // 🔹 Default gap between sections
    const totalSeats = partiesData.reduce((sum, party) => sum + party.seats, 0);
    const centerX = width / 2;
    const centerY = height / circleHeightAdjuster;
    const seatData = [];
  
    let totalAngle = angleEnd - angleStart;
    let numParties = partiesData.length;
    let totalGapAngle = numParties * sectionGap; // 🔹 Total gap space
    let availableAngle = totalAngle - totalGapAngle; // 🔹 Adjusted angle after accounting for gaps
  
    let seatRadius = Math.min(10, (radius / (rows * 2)) * 0.8);
    seatRadius = Math.max(seatRadius, 2);
    let rowHeight = seatRadius * 2.2;
  
    let currentAngle = angleStart;
    let seatCounter = 1; // 🔹 Global seat counter to assign seat IDs

  // 🔹 Convert peopleData to a Map for quick lookup by ID
  const peopleBySeatId = new Map(peopleData.map(person => [person.id, person]));

  for (const party of partiesData) {
    let partySeats = party.seats;
    let partyAngleSpan = (partySeats / totalSeats) * availableAngle;

    let seatIndex = 0;
    let seatsRemaining = partySeats;
    let rowSeatsDistribution = [];

    let totalRowCircumference = 0;
    for (let row = 0; row < rows; row++) {
      let rowRadius = radius - (row * rowHeight);
      totalRowCircumference += rowRadius;
    }

    for (let row = 0; row < rows; row++) {
      let rowRadius = radius - (row * rowHeight);
      let seatsInRow = Math.round((rowRadius / totalRowCircumference) * partySeats);
      rowSeatsDistribution.push(seatsInRow);
    }

    for (let row = 0; row < rows; row++) {
      let rowRadius = radius - (row * rowHeight);
      let seatsInRow = rowSeatsDistribution[row];

      if (seatsInRow < 1) continue;

      for (let i = 0; i < seatsInRow; i++) {
        let angle = currentAngle + (i / seatsInRow) * partyAngleSpan;
        let x = centerX + rowRadius * Math.cos(angle);
        let y = centerY - rowRadius * Math.sin(angle);

        let seatId = `seat-${seatCounter}`; // 🔹 Assign a unique seat ID
        seatCounter++;

        // 🔹 Check if a person is assigned to this seat ID
        let person = peopleBySeatId.get(seatId) || { id: seatId, name: "Unknown", party: party.party, role: "Unoccupied" };

        seatData.push({
          x, y,
          seatId,
          party: party.party,
          color: party.color,
          person
        });

        seatIndex++;
        seatsRemaining--;
        if (seatsRemaining <= 0) break;
      }
    }

    currentAngle += partyAngleSpan + sectionGap;
  }

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "relative");

  // 🔹 Tooltip Setup
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("box-shadow", "2px 2px 10px rgba(0,0,0,0.3)");

  // Draw seats with tooltips
  svg.selectAll("circle")
    .data(seatData)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", seatRadius*seatFactor)
    .attr("fill", d => d.color)
    .attr("stroke", "black")
    .style("cursor", "pointer")
    .on("mouseover", function (event, d) {
      tooltip
        .html(`<strong>Seat ID:</strong> ${d.seatId}<br><strong>${d.person.name}</strong><br>Party: ${d.person.party}<br>Role: ${d.person.role}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`)
        .style("visibility", "visible");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });

  return svg.node();
}