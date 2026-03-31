import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "../../garden.json");

type Observation = {
  date: string;
  note: string;
  severity: string;
};

type CareChange = {
  date: string;
  field: string;
  previous_value: string;
  new_value: string;
  reason: string;
};

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
  observations?: Observation[];
  care_history?: CareChange[];
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
  },
  async observe(plantId: number, note: string, severity: string) {
  await db.read();
  const plant = db.data.plants.find(p => p.id === plantId);
  if (!plant) throw new Error(`Plant ${plantId} not found`);

  if (!plant.observations) plant.observations = [];
  plant.observations.push({
    date: new Date().toISOString(),
    note,
    severity  // "info" | "warning" | "critical"
  });
  await db.write();
  return plant.observations.length;
},

async updateCareProfile(plantId: number, field: string, value: string, reason: string) {
  await db.read();
  const plant = db.data.plants.find(p => p.id === plantId);
  if (!plant) throw new Error(`Plant ${plantId} not found`);

  if (!plant.care_profile) throw new Error(`No care profile for plant ${plantId}`);

  // Save previous value before overwriting
  if (!plant.care_history) plant.care_history = [];
  plant.care_history.push({
    date: new Date().toISOString(),
    field,
    previous_value: (plant.care_profile as Record<string, string>)[field],
    new_value: value,
    reason
  });

  // Update the live care profile
  (plant.care_profile as Record<string, string>)[field] = value;
  await db.write();
  return true;
},

async getHistory(plantId: number) {
  await db.read();
  const plant = db.data.plants.find(p => p.id === plantId);
  if (!plant) throw new Error(`Plant ${plantId} not found`);
  return {
    observations: plant.observations ?? [],
    care_history: plant.care_history ?? []
  };
}

};