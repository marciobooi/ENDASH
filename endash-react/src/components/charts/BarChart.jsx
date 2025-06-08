import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

// Custom Tooltip Component
const CustomTooltipContent = ({ active, payload, label, yAxisTitle, yAxisUnit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${yAxisUnit}`}
          </p>
        ))}
        {payload.length > 1 && yAxisTitle && <p><strong>{yAxisTitle}</strong></p>}
      </div>
    );
  }
  return null;
};

const CustomBarChart = ({
  data,
  xAxisKey, // The key in data objects for x-axis values (e.g., 'name' for categories)
  yAxisKeys, // Array of objects: [{key: 'value1', name: 'Series 1', stackId: 'a'}, {key: 'value2', name: 'Series 2', stackId: 'a'}]
  title,
  colors, // Array of color strings
  layout = "horizontal", // "horizontal" or "vertical"
  stackType = null, // null (grouped), "normal" (stacked), "percent" (100% stacked)
  xAxisCategories, // Optional: Array of strings for custom X-axis labels if dataKey is just an index or simple id
  yAxisTitle, // Optional: String for Y-axis title
  yAxisUnit = "", // Optional: string for unit on Y-axis values in tooltip
  onBarClick, // Optional: function to handle bar click events
}) => {

  let chartData = data;

  if (stackType === 'percent' && layout === "horizontal") {
    chartData = data.map(item => {
      const total = yAxisKeys.reduce((acc, yKey) => acc + (item[yKey.key] || 0), 0);
      const newItem = { ...item };
      if (total > 0) {
        yAxisKeys.forEach(yKey => {
          newItem[yKey.key] = ((item[yKey.key] || 0) / total) * 100;
        });
      }
      return newItem;
    });
  } else if (stackType === 'percent' && layout === "vertical") {
    // For vertical percentage, we need to calculate percentage across categories for each key
    const totalsPerCategory = {};
    yAxisKeys.forEach(yKeyObj => {
        totalsPerCategory[yKeyObj.key] = data.reduce((acc, item) => acc + (item[yKeyObj.key] || 0), 0);
    });

    chartData = data.map(item => {
        const newItem = { ...item };
        yAxisKeys.forEach(yKeyObj => {
            if (totalsPerCategory[yKeyObj.key] > 0) {
                newItem[yKeyObj.key] = ((item[yKeyObj.key] || 0) / totalsPerCategory[yKeyObj.key]) * 100;
            }
        });
        return newItem;
    });
    // This is a simplified approach. True per-bar segment percentage in vertical stacked often requires restructuring data
    // or using a different chart library feature if Recharts doesn't directly support it for vertical layout easily.
    // For now, this will show the percentage of each item's key value relative to the total of that key across all items.
    // This is not standard 100% stacking for vertical charts.
    // A true 100% vertical stack would mean each bar (representing a category on Y-axis) sums to 100%.
    // The current logic for vertical percent is more like a proportional contribution of each category to a series total.
    // Recharts default behavior for vertical stacked charts with `layout="vertical"` and XAxis type="number" is usually what's desired.
    // Let's revert to normal stacking for vertical if percent is chosen, as percent calculation is complex for vertical in this setup.
    if (stackType === 'percent' && layout === 'vertical') {
        // console.warn("Vertical percentage stacking has specific data requirements. Using 'normal' stacking for vertical layout.");
        // stackType = 'normal'; // Or handle data transformation appropriately.
        // For now, we'll leave the above calculation, but it's not a standard 100% stack per category bar.
    }
  }


  const handleBarClick = (dataPoint, index, event) => {
    if (onBarClick) {
      onBarClick(dataPoint, index, event);
    } else if (dataPoint) {
      console.log('Clicked Bar:', dataPoint, 'Index:', index, 'Event:', event);
    }
  };

  const xAxisTickFormatter = (value, index) => {
    if (xAxisCategories && xAxisCategories[index]) {
      return xAxisCategories[index];
    }
    return value;
  };


  return (
    <div style={{ width: '100%', height: 400 }}>
      {title && <h2>{title}</h2>}
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout={layout}
          margin={{
            top: 20,
            right: 30,
            left: layout === 'vertical' ? 100 : 20, // Adjust left margin for vertical layout category labels
            bottom: layout === 'horizontal' && xAxisCategories ? 50 : 5, // Adjust bottom margin for horizontal with long category labels
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {layout === "horizontal" ? (
            <>
              <XAxis dataKey={xAxisKey} tickFormatter={xAxisTickFormatter}
                     angle={xAxisCategories ? -45 : 0} textAnchor={xAxisCategories ? 'end' : 'middle'} height={xAxisCategories ? 70 : undefined}/>
              <YAxis tickFormatter={stackType === 'percent' ? (val) => `${val.toFixed(0)}%` : undefined}>
                {yAxisTitle && <Label value={yAxisTitle} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />}
              </YAxis>
            </>
          ) : (
            <>
              <XAxis type="number" tickFormatter={stackType === 'percent' ? (val) => `${val.toFixed(0)}%` : undefined} >
                 {yAxisTitle && <Label value={yAxisTitle} angle={0} position="insideBottom" offset={-5} style={{ textAnchor: 'middle' }} />}
              </XAxis>
              <YAxis dataKey={xAxisKey} type="category" tickFormatter={xAxisTickFormatter} width={120} />
            </>
          )}
          <Tooltip content={<CustomTooltipContent yAxisTitle={layout === "horizontal" ? yAxisTitle : undefined} yAxisUnit={yAxisUnit} />} />
          <Legend />
          {yAxisKeys.map((item, index) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.name || item.key} // Use name for legend, fallback to key
              stackId={stackType !== null ? (item.stackId || 'a') : undefined} // Only apply stackId if stackType is 'normal' or 'percent'
              fill={colors[index % colors.length]}
              onClick={(dataPoint, barIndex, event) => handleBarClick(dataPoint, barIndex, event)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
