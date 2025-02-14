# bundestag
 
This little npm package aims to allow one to qick and dirty plot the arrangement of seats in the german bundestag. 

Specifically it is aimed at ObservablesHQ users.

The package with its one method can be imported via:

```
BundestagChart = await import("https://cdn.jsdelivr.net/npm/bundestag@1.2.10/+esm").then(m => m.BundestagChart)
```

into a ObservablesHQ cell. 

A potential workflow in ObservablesHQ is:

```
import { Inputs } from "@observablehq/inputs"
```

```
viewof rows = Inputs.range([3, 12], { label: "Number of Rows", step: 1, value: 8 })
```
```
viewof radius = Inputs.range([150, 400], { label: "Circle Radius", step: 10, value: 300 })
```

BundestagChart({
  width: 800,
  height: 600,
  radius,
  rows,
  partiesData: [
    { party: "LINKE", count: 39, color: "purple" },
    { party: "SPD", count: 206, color: "red" },
    { party: "GRÜNE", count: 118, color: "green" },
    { party: "FDP", count: 92, color: "yellow" },
    { party: "CDU/CSU", count: 197, color: "black" },
    { party: "AfD", count: 83, color: "blue" },
  ]
})


The following parameters can be set:
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
 * @param {Array} config.partiesData - Array of party data [{party: "SPD", count: 206, color: "red"}]
 * @returns {SVGElement} - Returns an SVG element
 */

 An example would be:
 
 [!image](./example.png)