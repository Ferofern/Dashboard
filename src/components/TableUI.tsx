import { useTheme, Paper } from '@mui/material';
import type { Hourly } from '../types/DashboardTypes';

interface TableUIProps {
  loading: boolean;
  error: string | null;
  hourlyData?: Hourly;
}

export default function TableUI({ loading, error, hourlyData }: TableUIProps) {
  const theme = useTheme();

  if (loading) return <p>Cargando tabla...</p>;
  if (error) return <p>Error en tabla: {error}</p>;
  if (!hourlyData) return <p>No hay datos para mostrar</p>;

  return (
    <Paper
      elevation={3}
      sx={{
        overflowX: 'auto',
        width: '100%',
        maxHeight: '400px',   // Limitar altura vertical para no crecer demasiado
      }}
    >
      <table
        style={{
          width: '100%',
          minWidth: '600px',  // Ancho mínimo para evitar que se compacte demasiado horizontalmente
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
            }}
          >
            <th
              style={{
                padding: '8px 12px',
                borderBottom: `2px solid ${theme.palette.divider}`,
                textAlign: 'left',
                color: theme.palette.text.primary,
                whiteSpace: 'nowrap',
              }}
            >
              Hora
            </th>
            <th
              style={{
                padding: '8px 12px',
                borderBottom: `2px solid ${theme.palette.divider}`,
                textAlign: 'left',
                color: theme.palette.text.primary,
                whiteSpace: 'nowrap',
              }}
            >
              Temperatura (°C)
            </th>
          </tr>
        </thead>
        <tbody>
          {hourlyData.time.map((time, index) => (
            <tr
              key={time}
              style={{
                backgroundColor: index % 2 === 0
                  ? theme.palette.action.hover
                  : 'transparent',
              }}
            >
              <td
                style={{
                  padding: '6px 12px',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                }}
              >
                {time.replace('T', ' ')}
              </td>
              <td
                style={{
                  padding: '6px 12px',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {hourlyData.temperature_2m[index].toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>
  );
}
