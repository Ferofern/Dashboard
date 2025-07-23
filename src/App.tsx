import { useState, useMemo } from 'react';
import {
  CssBaseline,
  Typography,
  Button,
  TextField,
  Box,
  Switch,
  FormControlLabel,
  createTheme,
  ThemeProvider,
  Paper,
} from '@mui/material';

import HeaderUI from './components/HeaderUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import ChartUI from './components/ChartUI';
import TableUI from './components/TableUI';
import AlertUI from './components/AlertUI';
import WindCompass from './components/WindCompass';
import DroneCard from './components/DroneCard';
import DailyForecastUI from './components/DailyForecastUI';
import DataFetcher from './functions/DataFetcher';
import { askCohere } from './functions/CohereAssistant';

const cities = [
  { name: 'Machala', latitude: -3.2586, longitude: -79.9605 },
  { name: 'Guayaquil', latitude: -2.1962, longitude: -79.8862 },
  { name: 'Quito', latitude: -0.2298, longitude: -78.525 },
  { name: 'Cuenca', latitude: -2.9005, longitude: -79.0045 },
];

const drones = [
  { name: 'DJI Mini 3 Pro', maxWind: 10.7, flightTime: '38 min' },
  { name: 'DJI Air 3', maxWind: 12, flightTime: '46 min' },
  { name: 'DJI Mavic 3 Enterprise', maxWind: 12, flightTime: '45 min' },
  { name: 'DJI Matrice 350', maxWind: 15, flightTime: '55 min' },
  { name: 'DJI Neo', maxWind: 8, flightTime: '18 min' },
];

function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const dataFetcherOutput = DataFetcher({
    latitude: selectedCity.latitude,
    longitude: selectedCity.longitude,
  });

  const handleCityChange = (cityName: string) => {
    const city = cities.find((c) => c.name === cityName);
    if (city) setSelectedCity(city);
  };

  const handleAskAssistant = async () => {
    if (!dataFetcherOutput.data) return;
    setLoadingAI(true);

    const weatherData = {
      ciudad: selectedCity.name,
      temperatura: `${dataFetcherOutput.data.current.temperature_2m} ${dataFetcherOutput.data.current_units.temperature_2m}`,
      humedad: `${dataFetcherOutput.data.current.relative_humidity_2m} ${dataFetcherOutput.data.current_units.relative_humidity_2m}`,
      condición: `Viento ${dataFetcherOutput.data.current.wind_speed_10m} ${dataFetcherOutput.data.current_units.wind_speed_10m}`,
    };

    const result = await askCohere(question, weatherData);
    setAiResponse(result.answer || result.error || '');
    setLoadingAI(false);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          background: {
            default: darkMode ? '#121212' : '#fafafa',
            paper: darkMode ? '#1d1d1d' : '#fff',
          },
        },
        typography: {
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          h5: { fontWeight: 700 },
          h6: { fontWeight: 600 },
        },
        components: {
          MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
          MuiPaper: { styleOverrides: { root: { padding: '1rem' } } },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh' }}>
        {/* HEADER + DARK MODE TOGGLE */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Box>
            <HeaderUI />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode((prev) => !prev)}
                  color="primary"
                />
              }
              label="Modo Oscuro"
            />
          </Box>
        </Box>

        {/* MAIN SELECTOR + INDICATORS */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 3fr' }, 
          gap: 3, 
          mb: 3 
        }}>
          <Box>
            <Paper elevation={3}>
              <SelectorUI
                cities={cities}
                selectedCity={selectedCity.name}
                onCityChange={handleCityChange}
              />
            </Paper>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2 
          }}>
            {dataFetcherOutput.data && (
              <>
                <Box>
                  <IndicatorUI
                    title="Temperatura (2m)"
                    description={`${dataFetcherOutput.data.current.temperature_2m} °C`}
                  />
                </Box>
                <Box>
                  <IndicatorUI
                    title="Humedad Relativa"
                    description={`${dataFetcherOutput.data.current.relative_humidity_2m}%`}
                  />
                </Box>
                <Box>
                  <IndicatorUI
                    title="Viento"
                    description={`${dataFetcherOutput.data.current.wind_speed_10m} m/s`}
                  />
                </Box>
                <Box>
                  <WindCompass direction={dataFetcherOutput.data.current.wind_direction_10m} />
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* DAILY FORECAST */}
        <Box sx={{ mb: 3 }}>
          <Paper elevation={3}>
            <DailyForecastUI daily={dataFetcherOutput.data?.daily} />
          </Paper>
        </Box>

        {/* CHART & TABLE */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 3, 
          mb: 3 
        }}>
          <Box>
            <Paper elevation={3}>
              <ChartUI
                loading={dataFetcherOutput.loading}
                error={dataFetcherOutput.error}
                hourlyData={dataFetcherOutput.data?.hourly}
              />
            </Paper>
          </Box>
          <Box>
            <Paper elevation={3}>
              <TableUI
                loading={dataFetcherOutput.loading}
                error={dataFetcherOutput.error}
                hourlyData={dataFetcherOutput.data?.hourly}
              />
            </Paper>
          </Box>
        </Box>

        {/* DRONE CARDS */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Modelos DJI vs Clima Actual
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2 
          }}>
            {dataFetcherOutput.data &&
              drones.map((drone) => (
                <Box key={drone.name}>
                  <DroneCard
                    name={drone.name}
                    maxWind={drone.maxWind}
                    flightTime={drone.flightTime}
                    currentWind={dataFetcherOutput.data.current.wind_speed_10m}
                  />
                </Box>
              ))}
          </Box>
        </Box>

        {/* ASSISTANT QUESTION SECTION */}
        <Box sx={{ mb: 3 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ¿Preguntas sobre el clima para tu dron?
            </Typography>
            <TextField
              fullWidth
              label="Pregunta al asistente"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ mt: 1, mb: 2 }}
              multiline
              maxRows={3}
            />
            <Button variant="contained" onClick={handleAskAssistant} disabled={loadingAI}>
              {loadingAI ? 'Consultando...' : 'Consultar'}
            </Button>
            <Typography sx={{ mt: 2, whiteSpace: 'pre-line' }}>
              <strong>Respuesta:</strong> {aiResponse}
            </Typography>
          </Paper>
        </Box>

        {/* ALERT */}
        <Box>
          <AlertUI description="Recuerda verificar el viento antes de volar." severity="warning" />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
