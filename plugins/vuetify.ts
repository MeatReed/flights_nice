import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labs from 'vuetify/labs/components'

export default defineNuxtPlugin((nuxt) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    labs,
    directives,
  });

  nuxt.vueApp.use(vuetify);
});