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

const StockAndTrendDataChart = ({ title, data }) => {
  return (
    <div style={{ width: (window.innerWidth - 80) + 'px', height: (window.innerHeight - 80) + 'px', maxWidth: '1200px', maxHeight: '700px' }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height="47%">
        <ComposedChart
          data={data}
          syncId="StockAndTrendDataChart"
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
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line connectNulls yAxisId="left" type="monotone" name={"Close Price"} dataKey="close" stroke="#8884d8" dot={false} />
          <Bar yAxisId="right" name={"Volume"} dataKey="volume" fill="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>      
      <ResponsiveContainer width="100%" height="47%">
        <LineChart
          data={data}
          syncId="StockAndTrendDataChart"
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
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="right" connectNulls type="monotone" name={"Week"} dataKey="week" stroke="#0088FE" dot={false} />
          <Line yAxisId="right" connectNulls type="monotone" name={"Month"} dataKey="month" stroke="#00C49F" dot={false} />
          <Line yAxisId="left" connectNulls type="monotone" name={"Quarter"} dataKey="quarter" stroke="#AA336A" dot={false} />
          <Line yAxisId="left" connectNulls type="monotone" name={"Year"} dataKey="year" stroke="#FF8042" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


export default StockAndTrendDataChart
