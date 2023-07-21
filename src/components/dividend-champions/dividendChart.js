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

const DividendChart = ({ title, dividendCloseData, closeVolumeData }) => {
  return (
    <div style={{ width: (window.innerWidth - 80) + 'px', height: (window.innerHeight - 80) + 'px', maxWidth: '1200px', maxHeight: '800px' }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height="47%">
        <ComposedChart
          data={dividendCloseData}
          syncId="dividendCloseData"
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
          <YAxis yAxisId="left" domain={['auto', 'auto']} tickFormatter={(tick) => {
            return `${tick}%`;
          }} />
          <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} />
          <Tooltip />
          <Legend wrapperStyle={{ bottom: -5 }}/>
          <Line connectNulls yAxisId="right" type="monotone" name={"Dividend"} dataKey="Dividends" dot={{ stroke: '#FF8042', strokeWidth: 2 }} stroke="#FF8042" />
          <Line connectNulls yAxisId="left" type="monotone" name={"Annual Dividend Yield (%, Estimated)"} dataKey="EstimateDividendsYield" stroke="#8884d8" dot={false} unit="%" />
        </ComposedChart>
      </ResponsiveContainer>     
      <ResponsiveContainer width="100%" height="47%">
        <ComposedChart
          data={closeVolumeData}
          syncId="closeVolumeData"
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
          <Line connectNulls yAxisId="left" type="monotone" name={"Close Price"} dataKey="Close" stroke="#8884d8" dot={false} />
          <Bar yAxisId="right" name={"Volume"} dataKey="Volume" fill="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>     
    </div>
  )
}


export default DividendChart
