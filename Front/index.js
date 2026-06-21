// Register background push handlers before the React app loads.
import { registerRootComponent } from "expo";
import App from "./app/index";

registerRootComponent(App);
