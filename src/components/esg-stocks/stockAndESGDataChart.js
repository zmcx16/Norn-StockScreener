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

const StockAndESGDataChart = ({ symbol, peerGroup, data }) => {
  return (
    <div style={{ width: (window.innerWidth - 80) + 'px', height: (window.innerHeight - 80) + 'px', maxWidth: '1200px', maxHeight: '800px' }}>
      <h3>{`${symbol} ESG Chart`}</h3>
      <ResponsiveContainer width="100%" height="47%">
        <ComposedChart
          data={data}
          syncId="StockAndESGDataChart"
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
          <Tooltip />
          <Legend wrapperStyle={{ bottom: -5 }}/>
          <Line connectNulls yAxisId="left" type="monotone" name={symbol + " Score"} dataKey={symbol + "_esgScore"} stroke="#0088FE"/>
          <Line connectNulls yAxisId="left" type="monotone" name={peerGroup + " Score"} dataKey={peerGroup + "_esgScore"} stroke="#AA336A"/>
        </ComposedChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height="47%">
        <ComposedChart
          data={data}
          syncId="StockAndESGDataChart"
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
          <Tooltip />
          <Legend wrapperStyle={{ bottom: -5 }}/>
          <Line connectNulls yAxisId="left" type="monotone" name={symbol + " Governance"} dataKey={symbol + "_governanceScore"} stroke="#FF0000"/>
          <Line connectNulls yAxisId="left" type="monotone" name={symbol + " Environment"} dataKey={symbol + "_environmentScore"} stroke="#FF00FF"/>
          <Line connectNulls yAxisId="left" type="monotone" name={symbol + " Social"} dataKey={symbol + "_socialScore"} stroke="#2828FF"/>
          <Line connectNulls yAxisId="left" type="monotone" name={peerGroup + " Governance"} dataKey={peerGroup + "_governanceScore"} stroke="#00AEAE"/>
          <Line connectNulls yAxisId="left" type="monotone" name={peerGroup + " Environment"} dataKey={peerGroup + "_environmentScore"} stroke="#00A600"/>
          <Line connectNulls yAxisId="left" type="monotone" name={peerGroup + " Social"} dataKey={peerGroup + "_socialScore"} stroke="#8C8C00"/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}


export default StockAndESGDataChart
