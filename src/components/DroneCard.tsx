import { Card, CardContent, Typography, Chip } from "@mui/material";

interface DroneCardProps {
  name: string;
  maxWind: number;
  flightTime: string;
  currentWind: number;
}

export default function DroneCard({ name, maxWind, flightTime, currentWind }: DroneCardProps) {
  const isSafe = currentWind <= maxWind;

  return (
    <Card sx={{ p: 2, border: isSafe ? "2px solid green" : "2px solid red" }}>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">Viento Máximo: {maxWind} m/s</Typography>
        <Typography variant="body2">Tiempo Vuelo: {flightTime}</Typography>
        <Chip
          label={isSafe ? "✅ Seguro para volar" : "⚠️ Riesgoso"}
          color={isSafe ? "success" : "error"}
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
}
