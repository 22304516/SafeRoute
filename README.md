Markdown

# 🛡️ SafeRoute — Solo Travel Protection Shield

SafeRoute is a standalone mobile tracking application built with React Native and Expo. It acts as an automated safety shield for solo travelers by utilizing real-time device sensor monitoring and location caching pipelines. The application operates on an **Offline-First** model, saving metrics locally before syncing data streams to a cloud infrastructure.

---

## 🚀 Core Features (Sprint 1 Milestone)

- **Journey Guard Dashboard:** A central control panel to activate/deactivate live sensor tracking, including an immediate manual emergency SOS broadcast feature.
- **Offline Relational Storage:** Complete CRUD management of trusted emergency contacts (Guardians) saved directly to device sandbox memory via SQLite.
- **Fail-Safe Routing Shell:** Structured navigation architecture spanning across Map telemetry diagnostics, Contact configuration, and the primary control views.

---

## 🛠️ Technical Architecture

The application utilizes a local cache layer to guarantee performance in low-connectivity zones, pairing client-side storage transactions with cloud synchronization handlers.

[Hardware Sensors / GPS Streams]
│
▼
[Local SQLite Cache] ──(Background Service)──> [Cloud Firestore]

- **Framework:** Expo SDK (Using Expo Router UI Navigation)
- **Local Database:** `expo-sqlite` (Relational schema tracking)
- **Cloud Backend:** Firebase JS SDK (Firestore database sandbox initialization)
- **Supported Platforms:** Android, iOS, and Web environments

---

## ⚙️ Environment Configuration

To run this project, you need to create a `.env` file at the root directory to store your Firebase sandbox credentials securely.

Create a `.env` file and add the following keys:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```
