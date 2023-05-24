import { handleHamburguerMenu } from "./loginButtons.js";

import {
  filterRenderSelect,
  renderAllCompanies,
  renderSelect,
} from "./render.js";

handleHamburguerMenu();
await renderSelect();
await renderAllCompanies();
filterRenderSelect();
