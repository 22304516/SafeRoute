// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo-metro-config').MetroConfig} */
// Pass the current folder path to get the default Expo metro configurations
const config = getDefaultConfig(__dirname);

// CRITICAL WASM FIX: Add wasm support to resolve the expo-sqlite asset resolution error
config.resolver.assetExts.push("wasm");
config.resolver.sourceExts.push("wasm");

module.exports = config;
