import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer, Label } from 'recharts';

// Custom Tooltip for Pie Chart
const CustomPieTooltipContent = ({ active, payload, yAxisUnit = '' }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // The data object for the slice
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p style={{ color: data.color || payload[0].fill }}>
          <strong>{`${data.name}`}</strong>: {`${data.value.toLocaleString()}${yAxisUnit}`}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Label for Pie Slices
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const percentageString = `${(percent * 100).toFixed(0)}%`;

  // Basic label: name and percentage. Value could be added if space allows or via a more complex label component.
  // This is a simplified version of the original formatter.
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {name} ({percentageString})
    </text>
  );
};


const CustomPieChart = ({
  data, // Array of data objects e.g., [{ name: 'Category A', value: 400, color: '#0088FE' }, ...]
  title,
  innerRadius = 0, // For donut chart, e.g., "60%" or 60 (pixels)
  outerRadius = "80%", // Default outer radius
  showLabels = true, // Whether to show data labels on slices
  yAxisUnit = "", // Unit for values in tooltip and potentially labels
  onSliceClick, // Optional: function to handle slice click events
}) => {

  const handleSliceClick = (dataPoint, index, event) => {
    if (onSliceClick) {
      onSliceClick(dataPoint, index, event);
    } else if (dataPoint) {
      console.log('Clicked Pie Slice:', {
        name: dataPoint.name,
        value: dataPoint.value,
        payload: dataPoint.payload, // The original data object for the slice
        index,
      });
    }
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      {title && <h2 style={{ textAlign: 'center' }}>{title}</h2>}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={showLabels ? renderCustomizedLabel : false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8" // Default fill, overridden by Cell
            dataKey="value"
            nameKey="name"
            onClick={handleSliceClick}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#000000'} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltipContent yAxisUnit={yAxisUnit} />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
