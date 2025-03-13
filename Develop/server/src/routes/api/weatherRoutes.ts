import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
 try {
  let cityName = req.body.cityName;

  const weatherData = await WeatherService.getWeatherForCity(cityName);
  await HistoryService.addCity(cityName);
  res.json(weatherData);

 } catch (err) {
   console.log(err);
   res.status(500).json(err);
  // TODO: save city to search history
}
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ msg: 'City is required' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'City successfully removed from searchhistory' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
