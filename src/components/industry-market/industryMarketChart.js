import React from 'react'
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Bar, 
  BarChart, 
  ReferenceLine,
  ResponsiveContainer 
} from 'recharts'

import moment from 'moment'

const IndustryMarketChart = ({ marketData, perfData, info}) => {
  return (  
    <div style={{ width: (window.innerWidth - 100) + 'px', height: (window.innerHeight - 100) + 'px', maxWidth: '1200px', maxHeight: '800px' }}>
      <ResponsiveContainer width="100%" height="47%">
        <LineChart
          data={marketData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" tickFormatter={(tickItem) => {
            return moment(tickItem).format('MM/DD/YYYY')
          }}/>
          <YAxis domain={['auto', 'auto']}/>
          <Tooltip />
          <Legend wrapperStyle={{ bottom: -15 }}/>
          <Line type="monotone" name={`Market (${info.market})`} dataKey="Close" stroke="#8884d8" dot={false}/>
        </LineChart>
      </ResponsiveContainer>
      <div style={{height:"6%"}}></div>
      <ResponsiveContainer width="100%" height="47%">
        <BarChart
          data={perfData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(tick) => {
            return `${tick}%`;
          }} domain={['auto', 'auto']}/>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar name={`Industry (${info.industry})`} dataKey="industry" fill="#82ca9d" unit="%" />
          <Bar name={`Market (${info.market})`} dataKey="market" fill="#8884d8" unit="%" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


export default IndustryMarketChart
