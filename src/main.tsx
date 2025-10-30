import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { FlashcardsProvider } from "@/context/FlashcardsContext";

createRoot(document.getElementById("root")!).render(
<FlashcardsProvider>
  <App />
</FlashcardsProvider>);