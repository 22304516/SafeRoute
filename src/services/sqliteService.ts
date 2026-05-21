import * as SQLite from "expo-sqlite";

// Setting up the typescript shapes so the rest of the app knows what a contact or waypoint looks like
export interface Contact {
  id?: number;
  name: string;
  phone: string;
}

export interface Waypoint {
  id?: number;
  latitude: number;
  longitude: number;
  timestamp: number;
  synced: number; // 0 means it's stuck on the phone, 1 means it successfully hit firestore
}

// Keeping track of the database instance globally so all functions can use it
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Fires up the database and creates the tables if they aren't already there
 */
export const initDatabase = async (): Promise<void> => {
  try {
    // Spin up or look for the local db file
    db = await SQLite.openDatabaseAsync("saferoute.db");

    // WAL mode helps make database reads and writes a bit speedier
    await db.execAsync(`PRAGMA journal_mode = WAL;`);

    // Table 1: Storing the user's emergency contacts
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL
      );
    `);

    // Table 2: Storing breadcrumb GPS locations for offline tracking
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS waypoints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        synced INTEGER DEFAULT 0
      );
    `);

    console.log("🎒 Relational local SQLite tables successfully initialized.");
  } catch (error) {
    console.error(
      "Critical failure during database structural initialization:",
      error,
    );
  }
};

/* ==========================================================================
   GUARDIAN / CONTACTS DATABASE LOGIC
   ========================================================================== */

// Saves a new emergency contact to the device storage
export const addLocalContact = async (
  name: string,
  phone: string,
): Promise<number | null> => {
  if (!db) return null; // safety check to ensure db is open first
  try {
    const result = await db.runAsync(
      "INSERT INTO contacts (name, phone) VALUES (?, ?);",
      [name, phone],
    );
    return result.lastInsertRowId; // need this ID to handle state updates or deletes later
  } catch (error) {
    console.error("Failed to insert contact into SQLite:", error);
    return null;
  }
};

// Grabs all saved guardians from the database, newest first
export const getLocalContacts = async (): Promise<Contact[]> => {
  if (!db) return [];
  try {
    const allRows = await db.getAllAsync<Contact>(
      "SELECT * FROM contacts ORDER BY id DESC;",
    );
    return allRows;
  } catch (error) {
    console.error("Failed to fetch contacts from SQLite:", error);
    return [];
  }
};

// Wipe a guardian out of the database using their unique row ID
export const deleteLocalContact = async (id: number): Promise<void> => {
  if (!db) return;
  try {
    await db.runAsync("DELETE FROM contacts WHERE id = ?;", [id]);
  } catch (error) {
    console.error("Failed to delete contact from SQLite:", error);
  }
};

/* ==========================================================================
   WAYPOINT / LOCATION DATABASE LOGIC
   ========================================================================== */

// Logs current GPS position locally. Sets synced to 0 because it hasn't hit Firebase yet
export const saveLocalWaypoint = async (
  lat: number,
  lng: number,
): Promise<void> => {
  if (!db) return;
  try {
    await db.runAsync(
      "INSERT INTO waypoints (latitude, longitude, timestamp, synced) VALUES (?, ?, ?, 0);",
      [lat, lng, Date.now()],
    );
    console.log(`📍 SQLite Cache Logged Coordinate: ${lat}, ${lng}`);
  } catch (error) {
    console.error("Failed to cache waypoint in SQLite:", error);
  }
};

// Pulls any coordinates that were saved while offline so the background worker can sync them to the cloud
export const getUnsyncedWaypoints = async (): Promise<Waypoint[]> => {
  if (!db) return [];
  try {
    return await db.getAllAsync<Waypoint>(
      "SELECT * FROM waypoints WHERE synced = 0;",
    );
  } catch (error) {
    console.error("Failed to fetch unsynced waypoints:", error);
    return [];
  }
};
