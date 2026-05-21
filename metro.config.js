// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo-metro-config').MetroConfig} */
// Just getting the standard default Metro setup that Expo uses out of the box
const config = getDefaultConfig(__dirname);

// FIXED THE WASM BUG: Added 'wasm' extensions here because expo-sqlite
// kept crashing when trying to resolve the webassembly files.
// This forces Metro to actually recognize and bundle them properly.
config.resolver.assetExts.push("wasm");
config.resolver.sourceExts.push("wasm");

// Exporting the modified config so the project bundler uses it on startup
module.exports = config;
