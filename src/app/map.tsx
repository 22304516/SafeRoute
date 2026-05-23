import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

// Expo Go / react-native-maps needs an official Google Maps API key and a
// cloud billing setup to download map tiles, otherwise it just shows a grey grid.
// To bypass that restriction on an emulator without dealing with Google Cloud,
// I am rendering an open-source Leaflet map inside a WebView container instead.
// This pulls map tiles, uninterrupted, for free while still using our real SQLite data.
let WebView: any = null;
if (Platform.OS !== "web") {
  WebView = require("react-native-webview").WebView;
}

interface MapCoordinate {
  latitude: number;
  longitude: number;
}

export default function MapPlaceholderScreen() {
  const [routeCoordinates, setRouteCoordinates] = useState<MapCoordinate[]>([]);
  const [currentPos, setCurrentPos] = useState<MapCoordinate | null>(null);
  const [dbInstance, setDbInstance] = useState<SQLite.SQLiteDatabase | null>(
    null,
  );
  const [tripDistance, setTripDistance] = useState<string>("0.00");

  // Connects to our local database right away when this screen is opened
  useEffect(() => {
    let active = true;
    const connectDb = async () => {
      try {
        const db = await SQLite.openDatabaseAsync("saferoute.db");
        if (active) setDbInstance(db);
      } catch (err) {
        console.error("Database connection failed:", err);
      }
    };
    connectDb();
    return () => {
      active = false;
    };
  }, []);

  // Sets up a loop that re-checks the database every 3 seconds to pull in fresh coordinates
  useEffect(() => {
    if (!dbInstance) return;
    fetchSavedWaypoints(dbInstance);
    const pollInterval = setInterval(() => {
      fetchSavedWaypoints(dbInstance);
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [dbInstance]);

  // Math helper function that calculates total distance traveled by connecting our coordinate dots
  const calculateTotalDistance = (coords: MapCoordinate[]): string => {
    if (coords.length < 2) return "0.00";
    let totalKm = 0;

    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const R = 6371; // Earth's radius in km
      const dLat = ((p2.latitude - p1.latitude) * Math.PI) / 180;
      const dLon = ((p2.longitude - p1.longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((p1.latitude * Math.PI) / 180) *
          Math.cos((p2.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalKm += R * c;
    }
    return totalKm.toFixed(2);
  };

  // Grabs the logged coordinates from the database, maps them to an array, and calculates total distance
  const fetchSavedWaypoints = async (db: SQLite.SQLiteDatabase) => {
    try {
      const rows = await db.getAllAsync<{
        latitude: number;
        longitude: number;
      }>("SELECT latitude, longitude FROM waypoints ORDER BY id ASC;");
      if (rows && rows.length > 0) {
        const points = rows.map((r) => ({
          latitude: r.latitude,
          longitude: r.longitude,
        }));
        setRouteCoordinates(points);
        setCurrentPos(points[points.length - 1]); // Pinpoint the most recent coordinate point
        setTripDistance(calculateTotalDistance(points));
      }
    } catch (err) {
      console.log("Awaiting local tables sync...");
    }
  };

  // Falls back to standard Bendigo coordinates if the database doesn't have any entries yet
  const mapCenterLat = currentPos?.latitude || -36.758;
  const mapCenterLng = currentPos?.longitude || 144.28;

  // Turns our coordinates array into a clean JSON string that Leaflet's HTML environment can parse
  const polylinePointsJSON = JSON.stringify(
    routeCoordinates.map((p) => [p.latitude, p.longitude]),
  );

  // The template block that runs our independent open-source Leaflet map instance
  const mapHtmlBundle = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #121212; }
        .leaflet-attribution-flag { display: none !important; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Start the map up and aim it right at our last known coordinate point
        var map = L.map('map', { zoomControl: false }).setView([${mapCenterLat}, ${mapCenterLng}], 16);
        
        // Load free dark-mode street tiles directly over the web without needing developer authorization keys
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        // Draw our current position dot right over our active tracking coordinates
        L.circleMarker([${mapCenterLat}, ${mapCenterLng}], {
          color: '#03DAC6',
          fillColor: '#03DAC6',
          fillOpacity: 0.8,
          radius: 8
        }).addTo(map);

        // If we have more than one coordinate point, draw the purple path line and auto-zoom to fit the whole trail
        var linePoints = ${polylinePointsJSON};
        if (linePoints.length > 1) {
          var polyline = L.polyline(linePoints, { color: '#BB86FC', weight: 5 }).addTo(map);
          map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        {Platform.OS === "web" ? (
          <View style={styles.mapCanvasMock}>
            <Text style={styles.mockTextHeader}>
              🛰️ Map View Active (Web Mode)
            </Text>
            <Text style={styles.mockTextSub}>
              Coordinates running on web sandbox.
            </Text>
          </View>
        ) : (
          // Mounts the Leaflet HTML configuration inside a native view window wrapper
          <WebView
            originWhitelist={["*"]}
            source={{ html: mapHtmlBundle }}
            style={StyleSheet.absoluteFillObject}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
      </View>

      {/* Floating status container detailing real-time travel statistics */}
      <View style={styles.dashboardPanel}>
        <View style={styles.row}>
          <Text style={styles.panelTitle}>🛡️ SafeRoute Active</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SECURE</Text>
          </View>
        </View>

        <Text style={styles.panelText}>
          {currentPos
            ? `Current Spot: ${currentPos.latitude.toFixed(4)}, ${currentPos.longitude.toFixed(4)}`
            : "Locating your current journey path..."}
        </Text>

        <Text style={styles.subText}>
          Total Distance Covered: {tripDistance} km ({routeCoordinates.length}{" "}
          check-ins)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  mapWrapper: { flex: 1, backgroundColor: "#121212" },
  mapCanvasMock: { flex: 1, justifyContent: "center", alignItems: "center" },
  mockTextHeader: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  mockTextSub: { color: "#A0A0A0", fontSize: 14, marginTop: 8 },
  dashboardPanel: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: "#1E1E1Eee",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2C2C2C",
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  panelTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  badge: {
    backgroundColor: "#03DAC622",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#03DAC6",
  },
  badgeText: {
    color: "#03DAC6",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  panelText: { color: "#E0E0E0", fontSize: 14, marginBottom: 4 },
  subText: { color: "#A0A0A0", fontSize: 12 },
});
