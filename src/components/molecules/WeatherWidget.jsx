import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const WeatherWidget = ({ location = "Springfield Farm", className = '' }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock weather data for demonstration
  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWeatherData({
        current: {
          temperature: 24,
          condition: 'Sunny',
          icon: 'Sun',
          humidity: 65,
          windSpeed: 8
        },
        forecast: [
          { day: 'Today', high: 26, low: 18, icon: 'Sun', condition: 'Sunny' },
          { day: 'Tomorrow', high: 28, low: 20, icon: 'Sun', condition: 'Sunny' },
          { day: 'Wed', high: 25, low: 17, icon: 'CloudRain', condition: 'Light Rain' },
          { day: 'Thu', high: 23, low: 16, icon: 'Cloud', condition: 'Cloudy' },
          { day: 'Fri', high: 27, low: 19, icon: 'Sun', condition: 'Sunny' }
        ],
        lastUpdated: new Date().toLocaleString()
      });
      
      setLoading(false);
    };

    loadWeatherData();
  }, []);

  if (loading) {
    return (
      <Card className={`weather-widget p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-white/30 rounded w-24"></div>
            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
          </div>
          <div className="h-12 bg-white/30 rounded w-32"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 h-16 bg-white/30 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!weatherData) return null;

  const { current, forecast } = weatherData;

  return (
    <Card className={`weather-widget p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-blue-900">{location}</h3>
          <p className="text-xs text-blue-700">Current Weather</p>
        </div>
        <ApperIcon name={current.icon} size={24} className="text-yellow-500" />
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-900">{current.temperature}°C</span>
          <span className="text-blue-700 capitalize">{current.condition}</span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-blue-600">
          <div className="flex items-center gap-1">
            <ApperIcon name="Droplets" size={14} />
            <span>{current.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Wind" size={14} />
            <span>{current.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-blue-900">5-Day Forecast</h4>
        <div className="grid grid-cols-5 gap-2">
          {forecast.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-2 rounded-lg bg-white/40"
            >
              <p className="text-xs font-medium text-blue-900 truncate">{day.day}</p>
              <ApperIcon name={day.icon} size={20} className="mx-auto my-1 text-blue-700" />
              <div className="text-xs">
                <div className="font-semibold text-blue-900">{day.high}°</div>
                <div className="text-blue-600">{day.low}°</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/30">
        <p className="text-xs text-blue-600">
          Last updated: {weatherData.lastUpdated}
        </p>
      </div>
    </Card>
  );
};

export default WeatherWidget;