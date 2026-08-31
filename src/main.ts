import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

import "temporal-polyfill/global"; // monkey patches the temporal API into safari

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
