import React, { Component } from 'react';
import IndexedDbService from '../../common/services/indexed-db-service';
import * as d3 from 'd3';
import * as d3contours from 'd3-contour';
import FormCheck from 'react-bootstrap/FormCheck';

const HeatMap = props => {
  const {
    mapName,
    mapUrl,
    rangeX,
    rangeY,
    domainX,
    domainY,
    iDb,
    phase
  } = props;

  clearTheImage();

  if (mapName)
    readTheCsv(mapName, mapUrl, rangeX, rangeY, domainX, domainY, iDb, phase);

  return (
    null
  );
};

export default HeatMap;

const clearTheImage = () => {
  var svg = d3.select('#d3-svg');
  svg.selectAll('*').remove();
};

const readTheCsv = (
  mapName,
  mapUrl,
  rangeX,
  rangeY,
  domainX,
  domainY,
  iDb,
  phase
) => {
  const side = Math.max(rangeY, rangeX);
  let height = side;
  let width = side;
  var svg = d3
    .select('#d3-svg')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g');

  if (phase == 'lobby') {
    /** don't show the map if you're in game */
    IndexedDbService.getMapImgData(iDb, mapName).then(imgData => {
      var myimage = svg
        .append('image')
        .attr('xlink:href', imgData)
        .attr('height', height)
        .attr('width', width);
    });
  }

  const dataUrl =
    'https://storage.googleapis.com/pubg-hackathon-published/landings/' +
    mapName +
    '.csv';
  d3.csv(dataUrl).then(data => {
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
    console.log('d3', mapName);

    var xScale = d3
      .scaleLinear()
      .domain([0, +domainX / 100])
      .range([0, width]);
    var yScale = d3
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

      const lastContour = contours[contours.length - 1].value;
      let maxDomain = lastContour;

      // Prepare a color palette
      var myColor = d3
        .scaleSequential()
        .interpolator(d3.interpolateYlOrRd)
        .domain([0, maxDomain]);

      d3.interpolateYlOrRd();

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

const hideContours = () => {
  d3.selectAll('path').style('display', 'none');
};

const showContours = () => {
  d3.selectAll('path').style('display', '');
};

const toggleContours = e => {
  if (e.target.checked) {
    hideContours();
  } else {
    showContours();
  }
};
