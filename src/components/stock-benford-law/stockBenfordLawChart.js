import React from 'react'
import shortid from 'shortid'
import {
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

const StockBenfordLawChart = ({ title, chartData, SSEData }) => {
  return (
    <>
    <h3>{title}</h3>
    <div style={{
      width: (window.innerWidth - 100) + 'px', height: (window.innerHeight - 100) + 'px', maxWidth: '1600px', maxHeight: '800px',
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr"
    }}>
      <ResponsiveContainer width="100%" height="100%" >
        <BarChart
          data={SSEData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <text
            x='55%'
            y='7%'
            dy={+12}
            style={{ fontWeight: 400, fill: '#82ca9d' }}
            width={"33%"}
            scaletofit={"true"}
            textAnchor='middle'
            verticalanchor='middle'
          >
            {"SSE Summary"}
          </text>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis  domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Bar name={`Last Quarter`} dataKey="lastQuarterSSE" fill="#82ca9d" />
          <Bar name={`Last Year`} dataKey="lastYearSSE" fill="#8884d8" />
          <Bar name={`All Quarters`} dataKey="allQuartersSSE" fill="#FF8042" />
          <Bar name={`All Years`} dataKey="allYearsSSE" fill="#FFD700" />
          <Bar name={`All Q & Y`} dataKey="allQuartersYearsSSE" fill="#FF4500" />
        </BarChart>
      </ResponsiveContainer>
      {
        Object.keys(chartData).map((key) => {
          return (
            <ResponsiveContainer width="100%" height="100%" key={shortid.generate()}>
              <BarChart
                data={chartData[key]["data"]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <text
                  x='55%'
                  y='7%'
                  dy={+12}
                  style={{ fontWeight: 400, fill: '#82ca9d' }}
                  width={"33%"}
                  scaletofit={"true"}
                  textAnchor='middle'
                  verticalanchor='middle'
                >
                  {chartData[key]["title"]}
                </text>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(tick) => {
                  return `${tick}%`;
                }} domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="#000" />
                <Bar name={`Financial Statement`} dataKey="dataProbs" fill="#82ca9d" unit="%" />
                <Bar name={`Benford's Law`} dataKey="benfordProbs" fill="#8884d8" unit="%" />
              </BarChart>
            </ResponsiveContainer>
          )
        }
        )}
    </div>
    </>
  )
}


export default StockBenfordLawChart
