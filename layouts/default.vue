<template>
  <v-layout>
    <v-navigation-drawer absolute permanent>
      <v-list>
        <v-list-group value="Arrivées">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-circle"
              title="Arrivées"
            ></v-list-item>
          </template>
          <v-list-item title="Terminal 1 et 2" nuxt to="/arrivals"></v-list-item>
          <v-list-item title="Terminal 1" nuxt to="/arrivals/t1"></v-list-item>
          <v-list-item title="Terminal 2" nuxt to="/arrivals/t2"></v-list-item>
        </v-list-group>

        <v-list-group value="Départs">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-circle"
              title="Départs"
            ></v-list-item>
          </template>
          <v-list-item title="Terminal 1 et 2" nuxt to="/departures"></v-list-item>
          <v-list-item title="Terminal 1" nuxt to="/departures/t1"></v-list-item>
          <v-list-item title="Terminal 2" nuxt to="/departures/t2"></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script>
export default {

}
</script>

<style>

</style>