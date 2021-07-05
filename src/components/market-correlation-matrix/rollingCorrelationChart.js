import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

import moment from 'moment'

const RollingCorrelationChart = ({ data, description }) => {
  return (
    <div style={{ width: (window.innerWidth - 100) + 'px', height: (window.innerHeight - 100) + 'px', maxWidth: '1200px', maxHeight: '600px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
          <YAxis domain={[-1, 1]}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" name={description} dataKey="Score" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


export default RollingCorrelationChart
