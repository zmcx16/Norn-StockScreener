import React from 'react'
import {
  LineChart,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

import moment from 'moment'

const StockAndTrendDataChart = ({ stockData, googleTrendData }) => {
  return (
    <div style={{ width: (window.innerWidth - 100) + 'px', height: (window.innerHeight - 100) + 'px', maxWidth: '1200px', maxHeight: '600px' }}>
      <ResponsiveContainer width="100%" height="47%">
        <ComposedChart
          data={stockData}
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
          }} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" name={"Close Price"} dataKey="Close" stroke="#8884d8" dot={false} />
          <Bar yAxisId="right" name={"Volume"} dataKey="Volume" fill="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>      
      <ResponsiveContainer width="100%" height="47%">
        <LineChart
          data={googleTrendData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" tickFormatter={(tickItem) => {
            return moment(tickItem).format('MM/DD/YYYY HH:mm:ss')
          }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="week" stroke="#0088FE" dot={false} />
          <Line type="monotone" dataKey="month" stroke="#00C49F" dot={false} />
          <Line type="monotone" dataKey="quarter" stroke="#FFBB28" dot={false} />
          <Line type="monotone" dataKey="year" stroke="#FF8042" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


export default StockAndTrendDataChart
