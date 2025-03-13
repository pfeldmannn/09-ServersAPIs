import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  cityName: string;
  date: string;
  tempF: string;
  description: string;
  icon: string;
  windSpeed: string;
  humidity: string;

  constructor(cityName: string, date: string, tempF: string, description: string, icon: string, windSpeed: string, humidity: string) {
    this.cityName = cityName;
    this.date = date;
    this.tempF = tempF;
    this.description = description; 
    this.icon = icon;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseUrl: string;
  private apiKey: string;
  cityName: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.log('Error fetching location data:', err);
      return err;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const {lat, lon} = locationData;
    return {lat,lon};
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseUrl}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const geocodeQuery = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(geocodeQuery);
    return this.destructureLocationData(locationData[0]);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const query = this.buildWeatherQuery(coordinates);
      const response = await fetch(query);
      console.log('response:', response);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.log('Error fetching weather data:', err);
      return err;
    }

  }

    // TODO: Complete buildForecastArray method
    private parseCurrentWeather(response: any) {
      // console.log('response:', response);
      const formattedDate = new Date(response.dt_txt).toLocaleDateString('en-US', {});
        const currentWeather = new Weather(
          this.cityName,
          formattedDate,
          response.main.temp,
          response.weather[0].description,
          response.weather[0].icon,
          response.wind.speed,
          response.main.humidity
        )

        return currentWeather;
    }

  // TODO: Build parseCurrentWeather method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastArray = [currentWeather];

    for (let i = 0; i < weatherData.length; i++) {
      const element = weatherData[i];

      if(element.dt_txt.endsWith('12:00:00')) { 
        const formattedDate = new Date(element.dt_txt).toLocaleDateString('en-US', {});
      const currentWeather = new Weather(
        this.cityName,
        formattedDate,
        element.main.temp,
        element.weather[0].description,
        element.weather[0].icon,
        element.wind.speed,
        element.main.humidity
      )
      forecastArray.push(currentWeather)
    }
    }
  
    return forecastArray;

  }



  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {

    this.cityName = city;

    const coordinates = await this.fetchAndDestructureLocationData();
 
    const weatherData = await this.fetchWeatherData(coordinates);
  

    const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);

    return forecastArray
  }
}

export default new WeatherService();
