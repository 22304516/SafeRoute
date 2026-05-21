import * as SQLite from "expo-sqlite";

// Core interfaces for your relational data structures
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
  synced: number; // 0 = local only, 1 = synced to cloud firestore
}

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initializes the SQLite database and sets up structural relational tables.
 */
export const initDatabase = async (): Promise<void> => {
  try {
    // Open or create the local standalone database file
    db = await SQLite.openDatabaseAsync("saferoute.db");

    // Enable Write-Ahead Logging (WAL) for faster storage transactions
    await db.execAsync(`PRAGMA journal_mode = WAL;`);

    // 1. Create Contacts Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL
      );
    `);

    // 2. Create Waypoints Tracking Table
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
   CONTACTS (GUARDIANS) TRANSACTION METHODS
   ========================================================================== */

export const addLocalContact = async (
  name: string,
  phone: string,
): Promise<number | null> => {
  if (!db) return null;
  try {
    const result = await db.runAsync(
      "INSERT INTO contacts (name, phone) VALUES (?, ?);",
      [name, phone],
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Failed to insert contact into SQLite:", error);
    return null;
  }
};

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

export const deleteLocalContact = async (id: number): Promise<void> => {
  if (!db) return;
  try {
    await db.runAsync("DELETE FROM contacts WHERE id = ?;", [id]);
  } catch (error) {
    console.error("Failed to delete contact from SQLite:", error);
  }
};

/* ==========================================================================
   WAYPOINTS (LOCATION) TRANSACTION METHODS
   ========================================================================== */

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
