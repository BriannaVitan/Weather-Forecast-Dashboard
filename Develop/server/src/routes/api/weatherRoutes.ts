import { Router, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';

dotenv.config();
const router = Router();

console.log(process.env);
console.log("Start");
console.log(process.env.API_KEY);
console.log(process.env.API_BASE_URL);
console.log("End");

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // res.status(418).send("This hasnt been implemented yet.");
  try {
    const cityName = req.body.cityName;
    if (!cityName) {
      return res.status(400).send({ error: "City name is required" });
    }

    const weatherData = await WeatherService.getWeatherForCity(cityName);
    if (weatherData) {
      HistoryService.addCity(cityName)
    }
      return res.send(JSON.stringify(weatherData));

    // TODO: save city to search history
  } catch (error) {
    console.error(error);
      return res.status(500).send({ error: "Failed to retrieve weather data" });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    console.log('history Service');
    let data = await HistoryService.getCities()
    return res.json(data) 
    // TODO: Implement logic to retrieve search history
    // res.send({ history: [] }); // Placeholder response
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to retrieve search history" });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(id);
    // TODO: Implement logic to delete the city from search history
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete city from search history" });
  }
});

export default router;

