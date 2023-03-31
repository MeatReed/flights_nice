<script setup>
const config = useRuntimeConfig()
let previousPage = -1
let page = 1

const { pending, data:flights } = await useLazyFetch(`${config.public.apiBase}/get_arrivals_flights?page=${page}`)

async function fetchPrevious() {
  pending.value = true
  let { data:previousFlights } = await useLazyFetch(`${config.public.apiBase}/get_arrivals_flights?page=${previousPage}`)
  previousPage = previousPage - 1
  flights.value = ref(combineFlightsByDate(flights.value, previousFlights.value)).value
  pending.value = false
}


function combineFlightsByDate(flightsByDate1, flightsByDate2) {
  
  const flightsByDate1Object = JSON.parse(JSON.stringify(flightsByDate1))
  const flightsByDate2Object = JSON.parse(JSON.stringify(flightsByDate2))

  const combinedFlights = {};

  for (let key in flightsByDate1Object) {
    if (flightsByDate2Object.hasOwnProperty(key)) {
      combinedFlights[key] = flightsByDate1Object[key].concat(flightsByDate2Object[key]);
    } else {
      combinedFlights[key] = flightsByDate1Object[key];
    }
  }

  for (let key in flightsByDate2Object) {
    if (!flightsByDate1Object.hasOwnProperty(key)) {
      combinedFlights[key] = flightsByDate2Object[key];
    }
  }

  return combinedFlights;
}

const refresh = () => refreshNuxtData()

setTimeout(() => {
  refresh()
}, "300000")
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
    <v-row>
      <v-col>
        <v-btn block nuxt to="/arrivals/t1">
          T1
        </v-btn>
      </v-col>
      <v-col>
        <v-btn block nuxt to="/arrivals/t2">
          T2
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block @click="refresh()">Refresh</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="pending">
      <v-col class="text-center">
        <v-progress-circular indeterminate :size="128"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn :disabled="pending" block @click="fetchPrevious()">
          Previous
        </v-btn>
      </v-col>
    </v-row>
    <div v-if="!pending">
      <v-row v-for="(flights_date, name) in flights">
        <v-col>
          <v-card class="text-center" color="grey">
            {{ new Date(name * 1000).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </v-card>
        </v-col>
        <v-col v-for="flight in flights_date" cols="12">
          <v-card
            flat
            rounded="0"
            variant="outlined"
          >
              <div class="d-flex flex-no-wrap align-center">
                <div>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'scheduled'">Départ <span class="text-green">{{ new Date(flight.flight.time.scheduled.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.scheduled.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'estimated' || flight.flight.status.generic.status.text == 'landed' || flight.flight.status.generic.status.text == 'delayed'">Décollage <span class="text-orange">{{ new Date(flight.flight.time.real.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.real.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'scheduled'">Arrivée <span class="text-green">{{ new Date(flight.flight.time.scheduled.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.scheduled.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'canceled'" class="text-black text-red">Annulée</v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'delayed'">Prévu à {{ new Date(flight.flight.time.estimated?.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.estimated.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'estimated'">Estimée à <span class="text-orange">{{ new Date(flight.flight.time.estimated.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.estimated.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'landed'">Arrivée à <span class="text-green">{{ new Date(flight.flight.time.real.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.real.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                </div>

                <v-avatar
                  size="125"
                  rounded="0"
                >
                  <v-img v-if="flight.flight.airline?.code.iata" :src="`https://cdn.flightradar24.com/assets/airlines/logotypes/${flight.flight.airline?.code.iata}_${flight.flight.airline?.code.icao}.png`"></v-img>
                  <v-img v-else :src="`https://www.flightradar24.com/static/images/data/operators/${flight.flight.airline?.code.icao}_logo0.png`"></v-img>
                </v-avatar>
                <div>
                  <v-card-title>
                    {{ flight.flight.airport.origin.name }} ({{ flight.flight.airport.origin.code?.iata }})
                  </v-card-title>

                  <v-card-subtitle>
                    {{ flight.flight.identification.number.default }} ({{ flight.flight.aircraft.model.code }} | {{ flight.flight.aircraft.model.text }})
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn v-if="flight.flight.identification.id" variant="tonal" nuxt :to="`/arrivals/${flight.flight.identification.id}`">Plus d'information</v-btn>
                  </v-card-actions>
                </div>
              </div>
            </v-card>
            <v-progress-linear :color="flight.flight.status.generic.status.color" model-value="100" :height="7"></v-progress-linear>
          <!-- {{ new Date(flight.flight.time.scheduled.arrival * 1000) }} | {{ flight.flight.airport.origin.name }} to Nice -->
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>