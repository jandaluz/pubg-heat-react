import React, { Component } from 'react';
import * as d3 from 'd3';
import * as d3contours from 'd3-contour';
import { Button } from 'react-bootstrap';

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = { showContours: true };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.showContours !== nextState.showContours ? false : true;
  }

  toggleContours = () => {
    const { showContours } = this.state;
    const btn = document.getElementsByClassName('btn')[0];

    if (showContours) {
      d3.selectAll('path').style('display', 'none');
      btn.textContent = 'Show Contours';
    } else {
      d3.selectAll('path').style('display', '');
      btn.textContent = 'Hide Contours';
    }
    this.setState({ showContours: !this.state.showContours });
  };
  render() {
    const { mapName, mapUrl, rangeX, rangeY, domainX, domainY } = this.props;
    const { showContours } = this.state;
    console.log('contour', showContours);
    clearTheImage();
    readTheCsv(mapName, mapUrl, rangeY, rangeX, domainX, domainY);

    return (
      <React.Fragment>
        <Button id="contour-btn" block onClick={this.toggleContours}>
          Hide Contours
        </Button>
      </React.Fragment>
    );
  }
}

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

  const myimage = svg
    .append('image')
    .attr('xlink:href', mapUrl)
    .attr('width', width)
    .attr('height', height)
    .on('mousemove', () => {
      //console.log(d3.event.pageX, d3.event.pageY);
      //console.log(d3.event.pageX / (1098/8160), d3.event.pageY / (1098/8160))
    })
    .on('click', () => {
      console.log(d3.event);
      console.log(
        '(',
        scaleImgToCoordinate(rangeX, domainX)(d3.event.pageX),
        scaleImgToCoordinate(rangeY, domainY)(d3.event.pageY),
        ')'
      );
    });
  console.log('img');
  console.log(myimage);

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

const scaleImgToCoordinate = (domain, range) => {
  return d3
    .scaleLinear()
    .domain([0, domain])
    .range([0, range]);
};
