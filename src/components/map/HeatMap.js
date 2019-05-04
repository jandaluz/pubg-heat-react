import React from 'react';
import * as d3 from 'd3';
import * as d3contours from 'd3-contour';

const HeatMap = props => {
  const { mapName, mapUrl, rangeX, rangeY, domainX, domainY } = props;

  clearTheImage();

  readTheCsv(mapName, mapUrl, rangeY, rangeX, domainX, domainY);

  return (
    null
  );
};

export default HeatMap;

const clearTheImage = () => {
  const svg = d3.select('#d3-svg');
  svg.selectAll('*').remove();
};

const readTheCsv = (mapName, mapUrl, rangeY, rangeX, domainX, domainY) => {
  console.log('read the csv');
  let height = rangeY;
  let width = rangeX;
  const svg = d3
    .select('#d3-svg')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');

  let dataUrl = '/pubg-hackathon-published/landings/' + mapName + '.csv';
  console.log(dataUrl);
  d3.csv(dataUrl, { cache: 'force-cache' }).then(data => {
    const landingCoords = data
      .filter(data => {
        return data.map_name === mapName;
      })
      .map(data => {
        return {
          x: +data.x / 100,
          y: +data.y / 100
        };
      });
    console.log(mapName);
    console.log(landingCoords);

    const xScale = d3
      .scaleLinear()
      .domain([0, +domainX / 100])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([0, +domainY / 100])
      .range([0, height]);

    if (landingCoords.length > 0) {
      let contours = d3contours
        .contourDensity()
        .x(d => {
          return xScale(d.x);
        })
        .y(d => {
          return yScale(d.y);
        })
        .size([domainX / 100, domainY / 100])
        .cellSize(8)(landingCoords);

      console.log(contours);
      const lastContour = contours[contours.length - 1].value;
      console.log(lastContour);
      let maxDomain = lastContour;

      // Prepare a color palette
      const myColor = d3
        .scaleSequential()
        .interpolator(d3.interpolateYlOrRd)
        .domain([0, maxDomain]);

      d3.interpolateYlOrRd();

      console.log('MAPURL', mapUrl);
      const myimage = svg
        .append('image')
        .attr('xlink:href', mapUrl)
        .attr('width', width)
        .attr('height', height);
      console.log('img');
      console.log(myimage);

      svg
        .insert('g')
        .selectAll('path')
        .data(contours)
        .join('path')
        .attr('d', d3.geoPath())
        .attr('fill', function(d) {
          return myColor(d.value);
        })
        .attr('class', 'contour');
    }
  });
};
