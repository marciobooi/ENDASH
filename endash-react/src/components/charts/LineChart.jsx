import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

// Custom Tooltip Component for Line Chart
const CustomLineTooltipContent = ({ active, payload, label, yAxisTitle, yAxisUnit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label"><strong>{label}</strong></p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.stroke || entry.color /* Color from line or legend item */ }}>
            {`${entry.name}: ${entry.value}${yAxisUnit}`}
          </p>
        ))}
        {/* {yAxisTitle && <p><strong>{yAxisTitle}</strong></p>} */}
      </div>
    );
  }
  return null;
};

const CustomLineChart = ({
  data, // Array of data objects e.g., [{ year: '2000', seriesA: 10, seriesB: 20 }, ...]
  xAxisKey, // Key for X-axis values in data objects (e.g., 'year')
  series, // Array of series objects e.g., [{ dataKey: 'seriesA', name: 'Series A', color: '#ff0000' }, ...]
  title,
  yAxisFormat, // For Recharts, this is more about tickFormatter. We'll use yAxisUnit for tooltip for now.
  yAxisTitle,
  yAxisUnit = "", // Unit for Y-axis values in tooltip
  // colors prop is effectively handled by series[n].color
  onLineClick, // Optional: function to handle line/point click events (not standard in Recharts Line, usually on points)
}) => {

  // Basic click handler for points on the line
  const handlePointClick = (event, chartPayload) => {
    if (onLineClick && chartPayload && chartPayload.payload) {
        // event here is the Recharts event object for the point
        // chartPayload contains the data point details
        onLineClick(chartPayload.payload, chartPayload.dataKey, event);
    } else if (chartPayload && chartPayload.payload) {
        console.log('Clicked Point on Line:', {
            category: chartPayload.payload[xAxisKey],
            seriesName: chartPayload.name, // Name of the series from legend
            value: chartPayload.value,
            fullDataPoint: chartPayload.payload,
        });
    }
  };


  return (
    <div style={{ width: '100%', height: 400 }}>
      {title && <h2>{title}</h2>}
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: yAxisTitle ? 20 : 5, // Adjust bottom margin if XAxis title (acting as YAxis title in this context)
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis tickFormatter={yAxisFormat ? ((value) => yAxisFormat.replace('{value}', value)) : undefined}>
            {yAxisTitle && <Label value={yAxisTitle} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />}
          </YAxis>
          <Tooltip content={<CustomLineTooltipContent yAxisUnit={yAxisUnit} />} />
          <Legend />
          {series.map((s, index) => (
            <Line
              key={s.dataKey}
              type="monotone" // Spline like curve
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color || '#000000'} // Default to black if no color provided
              activeDot={{ r: 8, onClick: handlePointClick }} // Make dots larger on hover/active and clickable
              dot={{ r: 3, onClick: handlePointClick }} // Regular dots also clickable
              // onClick={(eventProps, event) => handleLineClick(eventProps, event, s.dataKey)} // onClick on <Line> is for the whole line
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
