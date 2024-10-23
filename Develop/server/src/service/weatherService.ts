import { CipherInfo } from 'crypto';
import dotenv from 'dotenv';
import { query } from 'express';
import {v4 as uuid} from 'uuid';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  id: string;
  city: string;
  country: string;
}
// TODO: Define a class for the Weather object
class Weather implements Coordinates {
  id: string;
  city: string;
  date: string;
  country: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windspeed: number;
  humidity: number;

  constructor (
    city:string,
    date: string,
    country: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windspeed: number,
    humidity: number,

  ) {
    this.id = uuid();
    this.city = city;
    this.date = date;
    this.country = country;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windspeed = windspeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
// TODO: Define the baseURL, API key, and city name properties
class WeatherService {
  baseURL:string;
  apiKey:string;
  cityName: string = "";

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // TODO: Create fetchLocationData method
// private async fetchLocationData(query: string) {}

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates) {
    const params = new URLSearchParams({
      q: coordinates.city,
      appid: this.apiKey
    }.toString());
    const queryString = `${this.baseURL}${params}`;

    return queryString;
  }
 
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}

  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates) {
    try{
      fetch(this.buildWeatherQuery(coordinates))
      .then((data) => {
        this.parseCurrentWeather(data);
      });
    }catch(err){
       console.error(`[ERROR] Something went wrong: ${err}`)
    }
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response:any) {
    let cityWeather = new Weather(response.city,response.date, response.country, response.icon, response.iconDescription, response.tempF, response.windspeed, response.humidity);

    let weatherArray = this.buildForecastArray(cityWeather, JSON.parse(response.list));
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
return weatherData.map(data => {
  return new Weather(
    currentWeather.city,
    currentWeather.stateProv,
    currentWeather.country,
    data.dt_txt,
    data.weather[0].icon,
    data.weather[0].iconDescription,
    data.main.tempF,
    data.main.humidity
  );
});
}
  
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string, stateProv: string, country: string): Promise <Weather> {
    const coordinates = this.createCoordinates(city, stateProv, country);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData, coordinates);
  }
}

export default new WeatherService();
