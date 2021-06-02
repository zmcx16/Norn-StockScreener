import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ResponsiveContainer } from 'recharts'

import moment from 'moment'

const IndustryMarketChart = ({marketData}) => {
  return (  
    <ResponsiveContainer width="100%" height="100%">
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
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Close" stroke="#8884d8"/>
      </LineChart>
    </ResponsiveContainer>
  )
}


export default IndustryMarketChart
