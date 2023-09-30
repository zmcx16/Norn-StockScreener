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

const StockAndPCRDataChart = ({ title, data }) => {
  return (
    <div style={{ width: (window.innerWidth - 80) + 'px', height: (window.innerHeight - 80) + 'px', maxWidth: '1200px', maxHeight: '800px' }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height="32%">
        <ComposedChart
          data={data}
          syncId="StockAndPCRDataChart"
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
          syncId="StockAndPCRDataChart"
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
          <Line connectNulls yAxisId="left" type="monotone" name={"PCR OpenInterest"} dataKey="PCR_OpenInterest" stroke="#FF8042"/>
          <Line connectNulls yAxisId="right" type="monotone" name={"PCR Volume"} dataKey="PCR_Volume" stroke="#00C49F"/>
        </ComposedChart>
      </ResponsiveContainer>  
      <ResponsiveContainer width="100%" height="32%">
        <LineChart
          data={data}
          syncId="StockAndPCRDataChart"
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
          <Legend />
          <Line connectNulls yAxisId="left" type="monotone" name={"Calls Total OI"} dataKey="Calls_TotalOI" stroke="#FF8042"/>
          <Line connectNulls yAxisId="left" type="monotone" name={"Puts Total OI"} dataKey="Puts_TotalOI" stroke="#2828FF"/>
          <Line connectNulls yAxisId="right" type="monotone" name={"Calls Total Vol"} dataKey="Calls_TotalVol" stroke="#00C49F"/>
          <Line connectNulls yAxisId="right" type="monotone" name={"Puts Total Vol"} dataKey="Puts_TotalVol" stroke="#8C8C00"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


export default StockAndPCRDataChart
