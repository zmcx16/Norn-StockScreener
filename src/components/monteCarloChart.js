import React, { PureComponent } from 'react'
import shortid from 'shortid'
import {
  LineChart,
  Line,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts'


class CustomizedLabel extends PureComponent {
  render() {
    const { x, y, stroke, value, fontSize } = this.props;

    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={fontSize} textAnchor="middle">
        {value}
      </text>
    );
  }
}

const MonteCarloChart = ({ data, iteration, info, show_mean_label=true, modal_mode=true }) => {

  const dataLines = Array(iteration).fill(0).map((value, index) => {
    return <Line key={shortid.generate()}  type="monotone" dataKey={'Path-'+String(index).padStart(2, '0')} stroke={'#d3d3d3'} dot={false} strokeWidth={2}/>
  })
  // console.log(dataLines)
  const optionReferenceLines = "strike" in info && "cost" in info ? 
  <>          
    <ReferenceLine y={info.strike} label={{ position: 'insideBottomLeft',  value: 'Strike: ' + info.strike, fill: 'red', fontSize: 14 }} stroke="red" strokeDasharray="3 3" />
    <ReferenceLine y={info.cost} label={{ position: 'insideTopLeft',  value: 'Cost: ' + info.cost, fill: 'blue', fontSize: 14 }} stroke="blue" strokeDasharray="3 3" />
  </> : <></>

  const xAxisLabel = "symbol" in info ? 
  <Label value={"Symbol: " + info.symbol} offset={5} position="bottom" fill='#8884d8' fontSize={16} /> : <></>

  const chartStyle = modal_mode ? { width: (window.innerWidth - 100) + 'px', height: (window.innerHeight - 100) + 'px', maxWidth: '1200px', maxHeight: '600px' } : {width: '100%', height: '100%'}

  return (
    <div style={chartStyle}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Name">
            {xAxisLabel}
          </XAxis>
          <YAxis domain={['auto', 'auto']} />
          <Tooltip itemSorter={item => item.name}/>
          {dataLines}
          <Line type="monotone" dataKey="Mean" stroke="#FF8042" strokeWidth={3} label={show_mean_label ? <CustomizedLabel stroke={"#FF8042"} fontSize={14}/> : <></>} />
          {optionReferenceLines}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


export default MonteCarloChart
