import { Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import NavigationIcon from "@mui/icons-material/NavigationRounded";

interface WindCompassProps {
  direction: number;
}

export default function WindCompass({ direction }: WindCompassProps) {
  return (
    <Card sx={{ textAlign: "center", p: 2 }}>
      <CardContent>
        <Typography variant="subtitle1">Dirección del Viento</Typography>
        <NavigationIcon
          sx={{
            fontSize: 48,
            transform: `rotate(${direction}deg)`,
            transition: "transform 0.3s ease-in-out",
          }}
        />
        <Typography variant="body2">{direction}°</Typography>
      </CardContent>
    </Card>
  );
}
