import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

// DONE: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// DONE: Complete the HistoryService class
class HistoryService {

  // DONE: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFileSync(path.join(__dirname, '../../db/searchHistory.json'), 'utf8');
  }

  // DONE: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFileSync(path.join(__dirname, '../../db/searchHistory.json'), JSON.stringify(cities, null, '\t'));
  }

  // DONE: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }
      return parsedCities;
    })
  }

  // DONE: Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {

    if (!city) {
      throw new Error('city name is required');
    }
    const newCity: City = {name: city, id: uuidv4() };

    return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }

  // * BONUS DONE: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
