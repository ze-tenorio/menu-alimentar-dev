import { createRoot } from "react-dom/client";
import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";
import App from "./App.tsx";
import "./index.css";

// Initialize Amplitude Analytics with Session Replay
amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
amplitude.init("ea9f5e0aa0487a8cda4e3e3b0a32fa88", {
  autocapture: true,
  serverZone: "EU",
});

createRoot(document.getElementById("root")!).render(<App />);

