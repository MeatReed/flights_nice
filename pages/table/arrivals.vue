<script setup>
const { pending, data: flights } = useLazyFetch('http://192.168.1.87:5000/get_flights')
console.log(flights)
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn block nuxt to="/departures">
          Départ
        </v-btn>
      </v-col>
      <v-col>
        <v-btn block nuxt to="/arrivals">
          Arrivée
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="pending">
      <v-col class="text-center">
        <v-progress-circular indeterminate :size="128"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-if="!pending && flights.arrivals">
      <v-col>
        <v-data-table :items="flights.arrivals" item-value="flight.airport.origin.code.iata"></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>