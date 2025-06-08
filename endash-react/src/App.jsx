import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg' // Not used in current layout
// import viteLogo from '/vite.svg' // Not used in current layout
import './App.css'
// Line 5 (duplicate import) removed
import ECL from '@ecl/preset-ec/dist/scripts/ecl-ec'
// import CustomBarChart from './components/charts/BarChart'
// import CustomLineChart from './components/charts/LineChart'
// import CustomPieChart from './components/charts/PieChart'
import NavbarComponent from './components/layout/NavbarComponent'
import SubNavbarComponent from './components/layout/SubNavbarComponent' // Import SubNavbar
import MainContentComponent from './components/layout/MainContentComponent' // Import MainContent
import FooterComponent from './components/layout/FooterComponent'
import ShareModalComponent from './components/modals/ShareModalComponent' // Import ShareModal

// Sample Data for the Bar Chart
// const sampleChartData = [
//   { id: 'BE', name: 'Belgium', coal: 100, gas: 300, oil: 200, nuclear: 400, renewable: 150 },
//   { id: 'DE', name: 'Germany', coal: 500, gas: 250, oil: 150, nuclear: 200, renewable: 300 },
//   { id: 'FR', name: 'France', coal: 50, gas: 150, oil: 100, nuclear: 700, renewable: 250 },
//   { id: 'NL', name: 'Netherlands', coal: 120, gas: 350, oil: 180, nuclear: 50, renewable: 100 },
// ];

// Sample Data for Line Chart
// const sampleLineData = [
//   { year: '2010', gdp: 3.5, inflation: 1.2, unemployment: 5.5 },
//   { year: '2011', gdp: 2.8, inflation: 1.5, unemployment: 5.8 },
//   { year: '2012', gdp: 1.5, inflation: 1.3, unemployment: 6.2 },
//   { year: '2013', gdp: 1.9, inflation: 1.1, unemployment: 6.5 },
//   { year: '2014', gdp: 2.5, inflation: 0.8, unemployment: 6.1 },
//   { year: '2015', gdp: 2.9, inflation: 0.5, unemployment: 5.7 },
//   { year: '2016', gdp: 3.1, inflation: 0.7, unemployment: 5.3 },
//   { year: '2017', gdp: 3.3, inflation: 1.0, unemployment: 5.0 },
//   { year: '2018', gdp: 2.8, inflation: 1.2, unemployment: 4.8 },
//   { year: '2019', gdp: 2.5, inflation: 1.4, unemployment: 4.5 },
//   { year: '2020', gdp: -5.0, inflation: 0.9, unemployment: 7.0 }, // Example of a downturn
//   { year: '2021', gdp: 4.5, inflation: 2.5, unemployment: 6.0 },
// ];

// Sample Data for Pie Chart
// const samplePieData = [
//   { name: 'Residential', value: 450, color: '#0088FE' },
//   { name: 'Commercial', value: 300, color: '#00C49F' },
//   { name: 'Industrial', value: 200, color: '#FFBB28' },
//   { name: 'Transport', value: 150, color: '#FF8042' },
//   { name: 'Other', value: 100, color: '#A020F0' },
// ];

// const lineSeriesConfig = [
//   { dataKey: 'gdp', name: 'GDP Growth (%)', color: '#8884d8' },
//   { dataKey: 'inflation', name: 'Inflation Rate (%)', color: '#82ca9d' },
//   { dataKey: 'unemployment', name: 'Unemployment Rate (%)', color: '#ffc658' },
// ];
//
//
// const energySourceKeys = [
//   { key: 'coal', name: 'Coal', stackId: 'energy' },
//   { key: 'gas', name: 'Natural Gas', stackId: 'energy' },
//   { key: 'oil', name: 'Oil', stackId: 'energy' },
//   { key: 'nuclear', name: 'Nuclear', stackId: 'energy' },
//   { key: 'renewable', name: 'Renewable', stackId: 'energy' },
// ];
//
// const customColors = ['#A0522D', '#2E8B57', '#4682B4', '#FFD700', '#32CD32'];
// const countryNames = sampleChartData.map(d => d.name); // For xAxisCategories
//
// const handleBarClick = (dataPoint, index, event) => {
//   console.log('Bar clicked in App.jsx:', {
//     category: dataPoint?.[xAxisKeyForClick], // Assuming xAxisKeyForClick is available in scope or use dataPoint.name
//     seriesName: dataPoint?.name, // This might be tricky depending on how Recharts structures dataPoint for click
//     value: dataPoint?.value,
//     payload: dataPoint?.payload, // The original data object for the clicked bar segment
//     index,
//     event,
//   });
//   // Example: You might want to access dataPoint.payload[dataPoint.dataKey] to get the value of the specific series
//   // Or dataPoint.payload[xAxisKey] to get the category
// };
// // A bit of a placeholder for how to get category, needs to align with BarChart's dataPoint structure
// const xAxisKeyForClick = "name";


function App() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    ECL.autoInit(); // Initialize ECL components
    // Example: Listen for an event from SubNavbar to open modal (to be properly implemented later)
    const openModalHandler = () => setIsShareModalOpen(true);
    document.addEventListener('openShareModal', openModalHandler);
    return () => document.removeEventListener('openShareModal', openModalHandler);
  }, [])

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  // A dummy function to simulate triggering the modal from SubNavbar for now
  // In reality, this would be a prop passed to SubNavbar or a context/state management solution
  const triggerOpenShareModal = () => {
      // This is just for testing. The SubNavbar would need a way to call this.
      // For now, we can add a temporary button in App.jsx to test it, or rely on manual state change in dev tools.
      // Or, we can modify SubNavbarComponent to accept an onShareClick prop.
      // Let's assume SubNavbar will eventually call something like this.
      // For quick testing, I'll add a button in App.jsx temporarily.
      setIsShareModalOpen(true);
  };


  return (
    <>
      <NavbarComponent />
      <SubNavbarComponent /> {/* Render SubNavbar */}
      <main className="ecl-container ecl-container--m">
        {/* Button to test ShareModal visibility */}
        <button onClick={triggerOpenShareModal} className="ecl-button ecl-button--primary" style={{margin: '1rem 0'}}>Test Open Share Modal</button>
        <MainContentComponent /> {/* Render MainContent */}

        {/*
        Chart examples are commented out below.
        <hr />
        <h2>Recharts Bar Chart Examples</h2>
        <CustomBarChart
          data={sampleChartData}
          xAxisKey="id" // Using 'id' for dataKey, but displaying 'name' via xAxisCategories
          yAxisKeys={energySourceKeys}
          title="Energy Mix (Stacked)"
          colors={customColors}
          stackType="normal"
          xAxisCategories={countryNames}
          yAxisTitle="Energy (TWh)"
          yAxisUnit=" TWh"
          onBarClick={handleBarClick}
        />

        <CustomBarChart
          data={sampleChartData}
          xAxisKey="id"
          yAxisKeys={energySourceKeys}
          title="Energy Mix (Grouped)"
          colors={customColors}
          stackType={null} // Grouped
          xAxisCategories={countryNames}
          yAxisTitle="Energy (TWh)"
          yAxisUnit=" TWh"
          onBarClick={handleBarClick}
        />

        <CustomBarChart
          data={sampleChartData}
          xAxisKey="id"
          yAxisKeys={energySourceKeys}
          title="Energy Mix (100% Stacked)"
          colors={customColors}
          stackType="percent"
          xAxisCategories={countryNames}
          yAxisTitle="Energy Mix (%)"
          yAxisUnit="%"
          onBarClick={handleBarClick}
        />

        <CustomBarChart
          data={sampleChartData}
          xAxisKey="name" // For vertical, dataKey for YAxis should be the category field
          yAxisKeys={[{ key: 'coal', name: 'Coal' }, {key: 'gas', name: 'Natural Gas'}]}
          title="Coal & Gas Production (Vertical Stacked)"
          colors={['#A0522D', '#2E8B57']}
          layout="vertical"
          stackType="normal"
          yAxisTitle="Country" // This will be the X-axis title in vertical layout
          onBarClick={handleBarClick}
        />

        <CustomBarChart
          data={sampleChartData}
          xAxisKey="name"
          yAxisKeys={[{ key: 'renewable', name: 'Renewable Generation' }]}
          title="Renewable Generation (Single Series)"
          colors={['#32CD32']}
          yAxisTitle="Energy (TWh)"
          yAxisUnit=" TWh"
          onBarClick={handleBarClick}
        />

        <hr />
        <h2>Recharts Line Chart Example</h2>
        <CustomLineChart
          data={sampleLineData}
          xAxisKey="year"
          series={lineSeriesConfig}
          title="Economic Indicators Over Time"
          yAxisTitle="Percentage (%)"
          yAxisUnit="%"
          onLineClick={(dataPoint, dataKey, event) => {
            console.log('Clicked Point on Line in App.jsx:', { dataPoint, dataKey, eventName: event.name });
          }}
        />

        <hr />
        <h2>Recharts Pie Chart Examples</h2>
        <CustomPieChart
          data={samplePieData}
          title="Energy Consumption by Sector (Pie)"
          yAxisUnit=" GWh"
          onSliceClick={(dataPoint) => console.log("Pie Slice Clicked (Pie):", dataPoint)}
          showLabels={true}
        />

        <CustomPieChart
          data={samplePieData}
          title="Energy Consumption by Sector (Donut)"
          innerRadius="60%" // Makes it a donut
          outerRadius="90%"
          yAxisUnit=" GWh"
          onSliceClick={(dataPoint) => console.log("Pie Slice Clicked (Donut):", dataPoint)}
          showLabels={true} // Set to false if labels clutter the donut
        />
        */}
      </main>
      <FooterComponent />
      <ShareModalComponent
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        shareUrl="https://example.com/shared-content" // Example URL
        title="Share this Dashboard"
      />
    </>
  )
}

export default App
