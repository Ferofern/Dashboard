import { Card, CardContent, Typography, Grid } from "@mui/material";

interface DailyForecastUIProps {
  daily: any;
}

export default function DailyForecastUI({ daily }: DailyForecastUIProps) {
  if (!daily) return null;

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Pronóstico Diario</Typography>
        <Grid container spacing={2}>
          {daily.time.slice(0, 5).map((day: string, i: number) => (
            <Grid item xs={6} md={2.4} key={day}>
              <Typography variant="body1">{day}</Typography>
              <Typography variant="body2">🌡️ {daily.temperature_2m_max[i]}° / {daily.temperature_2m_min[i]}°</Typography>
              <Typography variant="body2">💨 {daily.wind_speed_10m_max[i]} m/s</Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
