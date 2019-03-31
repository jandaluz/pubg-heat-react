import React from 'react'

const heatmap = (props) => (
        <div style = {{backgroundImage: "url("+props.mapUrl+")", backgroundSize: "contain", width:800, height:800}}>
        </div>
    )

export default heatmap;