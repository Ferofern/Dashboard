import { Card, CardContent, Typography, Box } from "@mui/material";

interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  wind_speed_10m_max: number[];
}

interface DailyForecastUIProps {
  daily: DailyData | null | undefined;
}

export default function DailyForecastUI({ daily }: DailyForecastUIProps) {
  if (!daily) return null;

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Pronóstico Diario</Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, 
          gap: 2 
        }}>
          {daily.time.slice(0, 5).map((day: string, i: number) => (
            <Box key={day}>
              <Typography variant="body1">{day}</Typography>
              <Typography variant="body2">🌡️ {daily.temperature_2m_max[i]}° / {daily.temperature_2m_min[i]}°</Typography>
              <Typography variant="body2">💨 {daily.wind_speed_10m_max[i]} m/s</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
