<script setup>
const { data: flights } = await useFetch('http://192.168.1.87:5000/get_flights', {
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
})
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
    <v-row v-if="!pending && flights.arrivals">
      <v-col v-for="flight in flights.arrivals" cols="12">
        <v-card
          flat
          rounded="0"
          variant="outlined"
        >
            <div class="d-flex flex-no-wrap align-center">
              <div>

                <v-card-subtitle>Départ {{ new Date(flight.flight.time.scheduled.departure * 1000).getHours().toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.scheduled.departure * 1000).getMinutes().toString().padStart(2, '0') }}</v-card-subtitle>
                <v-card-subtitle>Arrivée {{ new Date(flight.flight.time.scheduled.arrival * 1000).getHours().toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.scheduled.arrival * 1000).getMinutes().toString().padStart(2, '0') }}</v-card-subtitle>
                <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'delayed'">Prévu à {{ new Date(flight.flight.time.estimated.arrival * 1000).getHours().toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.estimated.arrival * 1000).getMinutes().toString().padStart(2, '0') }}</v-card-subtitle>
                
              </div>

              <v-avatar
                size="125"
                rounded="0"
              >
                <v-img :src="`https://cdn.flightradar24.com/assets/airlines/logotypes/${flight.flight.airline?.code.iata}_${flight.flight.airline?.code.icao}.png`"></v-img>
              </v-avatar>
              <div>
                <v-card-title>
                  {{ flight.flight.airport.origin.name }} ({{ flight.flight.airport.origin.code.iata }})
                </v-card-title>

                <v-card-subtitle>
                  {{ flight.flight.identification.number.default }} ({{ flight.flight.aircraft.model.code }} | {{ flight.flight.aircraft.model.text }})
                </v-card-subtitle>
              </div>
            </div>
          </v-card>
          <v-progress-linear :color="flight.flight.status.generic.status.color" model-value="100" :height="7"></v-progress-linear>
        <!-- {{ new Date(flight.flight.time.scheduled.arrival * 1000) }} | {{ flight.flight.airport.origin.name }} to Nice -->
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