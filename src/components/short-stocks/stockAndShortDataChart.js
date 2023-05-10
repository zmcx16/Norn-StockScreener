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

const StockAndShortDataChart = ({ title, data }) => {
  return (
    <div style={{ width: (window.innerWidth - 80) + 'px', height: (window.innerHeight - 80) + 'px', maxWidth: '1200px', maxHeight: '800px' }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height="32%">
        <ComposedChart
          data={data}
          syncId="StockAndShortDataChart"
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
          <YAxis yAxisId="left" domain={['auto', 'auto']}/>
          <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']}/>
          <Tooltip />
          <Legend wrapperStyle={{ bottom: -5 }}/>
          <Line connectNulls yAxisId="left" type="monotone" name={"Close Price"} dataKey="close" stroke="#8884d8" dot={false} />
          <Bar yAxisId="right" name={"Volume"} dataKey="volume" fill="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>     
      <ResponsiveContainer width="100%" height="32%">
        <ComposedChart
          data={data}
          syncId="StockAndShortDataChart"
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
          <YAxis yAxisId="left" domain={['auto', 'auto']}/>
          <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']}/>
          <Tooltip />
          <Legend wrapperStyle={{ bottom: -5 }}/>
          <Line connectNulls yAxisId="left" type="monotone" name={"Short Interest"} dataKey="shortInterest" stroke="#FF8042" />
          <Bar yAxisId="right" name={"Avg Daily Volume"} dataKey="avgDailyVolume" fill="#00C49F" />
        </ComposedChart>
      </ResponsiveContainer>     
      <ResponsiveContainer width="100%" height="32%">
        <LineChart
          data={data}
          syncId="StockAndShortDataChart"
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
          <YAxis yAxisId="left" tickFormatter={(tick) => {
            return `${tick}%`;
          }} domain={['auto', 'auto']}/>
          <YAxis yAxisId="right"  orientation="right" domain={['auto', 'auto']}/>
          <Tooltip />
          <Legend />
          <Line yAxisId="left" connectNulls type="monotone" name={"Short Float"} dataKey="shortFloat" unit="%" stroke="#0088FE"/>
          <Line yAxisId="right" connectNulls type="monotone" name={"Short Ratio"} dataKey="shortRatio" stroke="#AA336A"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


export default StockAndShortDataChart
