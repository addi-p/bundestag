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
 * @param {Array} config.partiesData - Array of party data [{party: "SPD", count: 206, color: "red"}]
 * @returns {SVGElement} - Returns an SVG element
 */
export function BundestagChart({
  width = 800,
  height = 600,
  radius = 250,
  rows = 6,
  angleStart = Math.PI * 0.9,
  angleEnd = Math.PI * 2.1,
  partiesData = []
} = {}) {
  const totalSeats = partiesData.reduce((sum, party) => sum + party.count, 0);

  const centerX = width / 2;
  const centerY = height / 2;
  const seatData = [];

  let currentAngle = angleStart;
  let totalAngle = angleEnd - angleStart;

  let seatRadius = Math.min(10, (radius / (rows * 2)) * 0.8);
  seatRadius = Math.max(seatRadius, 2);
  let rowHeight = seatRadius * 2.2;

  for (const party of partiesData) {
    let partySeats = party.count;
    let partyAngleSpan = (partySeats / totalSeats) * totalAngle;

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

        seatData.push({
          x, y,
          party: party.party,
          color: party.color,
        });

        seatIndex++;
        seatsRemaining--;
        if (seatsRemaining <= 0) break;
      }
    }

    currentAngle += partyAngleSpan;
  }

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

  svg.selectAll("circle")
    .data(seatData)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", seatRadius)
    .attr("fill", d => d.color)
    .attr("stroke", "black");

  return svg.node();
}
