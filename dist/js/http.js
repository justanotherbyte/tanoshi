// With the Tauri global script, enabled when `tauri.conf.json > build > withGlobalTauri` is set to true:
const invoke = window.__TAURI__.invoke;

console.log(invoke);
// Invoke the command
invoke('make_request', {url: "https://github.com"});