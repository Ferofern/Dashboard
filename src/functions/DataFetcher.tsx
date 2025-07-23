import { useEffect, useState } from 'react';

const DataFetcher = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=auto`;

      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError('Error al obtener datos del clima.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { data, loading, error };
};

export default DataFetcher;
