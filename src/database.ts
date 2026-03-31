import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "../../garden.json");

type CareProfile = {
  watering: string;
  sunlight: string;
  feeding: string;
  pruning: string;
  seasonal_notes: string;
  difficulty: string;
  summary: string;
};

type Plant = {
  id: number;
  name: string;
  nickname: string;
  location: string;
  species: string;
  added_at: string;
  care_profile: CareProfile | null;
};

type GardenData = { plants: Plant[] };

const adapter = new JSONFile<GardenData>(DB_PATH);
const db = new Low(adapter, { plants: [] });

export const plantDB = {

  async add(name: string, nickname: string, location: string, species: string, care_profile: CareProfile) {
    await db.read();
    const id = Date.now();
    db.data.plants.push({
      id, name, nickname, location, species,
      added_at: new Date().toISOString(),
      care_profile
    });
    await db.write();
    return id;
  },

  async list() {
    await db.read();
    return db.data.plants;
  },

  async remove(id: number) {
    await db.read();
    db.data.plants = db.data.plants.filter(p => p.id !== id);
    await db.write();
  }

};