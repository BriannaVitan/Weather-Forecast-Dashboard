import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number,
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  baseURL: string;
  apiKey: string;
  cityName: string = "";

// TODO: Define the baseURL, API key, and city name properties
  constructor() {
    this.baseURL = process.env.API_BASE_URL || ''; //https:/
    this.apiKey = process.env.API_KEY || ''; // weather app API key
  }

// TODO: Create buildWeatherQuery method
  private buildWeatherQuery(city: string): string {
    return `${this.baseURL}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=imperial`; // gets the weather data
  }

// TODO: Complete buildForecastArray method
// private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastQuery(city: string): string {
    return `${this.baseURL}/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=imperial`; // gets the forecast
  }

// TODO: Create fetchWeatherData method
// private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(city: string): Promise<any> {
    const query = this.buildWeatherQuery(city);
    const response = await fetch(query); // Api fetch
    if (!response.ok) {
      throw new Error(`Failed to fetch current weather data for ${city}`);
    }
    return response.json(); // fetching the JSON data
  }

  private async fetchForecastData(city: string): Promise<any> {
    const query = this.buildForecastQuery(city);
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`Failed to fetch forecast data for ${city}`);
    }
    return response.json();
  }

// TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather { // grabbing info from server
    const city = response.name; 
    const date = new Date(response.dt * 1000).toISOString();
    const icon = response.weather[0].icon;
    const iconDescription = response.weather[0].description;
    const tempF = response.main.temp;
    const windspeed = response.wind.speed;
    const humidity = response.main.humidity;

    return new Weather(city, date, icon, iconDescription, tempF, windspeed, humidity);
  }
 
  private parseForecast(response: any): Weather[] { // grabbing info from server
    let filteredWeather = response.list.filter((data: any) => {
      return data.dt_txt.includes("12:00:00")
    })
    let forecastArray = filteredWeather.map((data: any) => {
      const city = response.city.name; 
      const date = new Date(data.dt * 1000).toISOString();
      const icon = data.weather[0].icon;
      const iconDescription = data.weather[0].description;
      const tempF = data.main.temp;
      const windspeed = data.wind.speed;
      const humidity = data.main.humidity; 

      return new Weather(city, date, icon, iconDescription, tempF, windspeed, humidity);
    }); 
    console.log(forecastArray)
    return forecastArray 
  }

// TODO: Complete getWeatherForCity method
// async getWeatherForCity(city: string) {}
  public async getWeatherForCity(city: string) {
    try {
      const weatherData = await this.fetchWeatherData(city);
      let currentWeather = this.parseCurrentWeather(weatherData);
      let forecastArray = await this.getWeatherForecastForCity(city);
      return [currentWeather, forecastArray]
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getWeatherForecastForCity(city: string): Promise<Weather[] | null> {
    try {
      const forecastData = await this.fetchForecastData(city);
      return await this.parseForecast(forecastData);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}


export default new WeatherService();