<script setup>
const config = useRuntimeConfig()
const autocomplete = ref()
let previousPage = ref(0)
let page = ref(1)
const disabledPreviousFlights = ref(false)
const disabledNextFlights = ref(false)
const searchFlights = ref()

const { pending, data:flights } = await useLazyFetch(`/api/get_departures_flights?page=${page.value}&terminal=2`)

async function fetchPrevious() {
  pending.value = true
  let { data:previousFlights } = await useLazyFetch(`/api/get_departures_flights?page=${previousPage.value}&terminal=2`)
  if (previousFlights.value.page.current == previousFlights.value.page.total) {
    disabledPreviousFlights.value = true
  }
  previousPage.value = previousPage.value - 1
  flights.value.data = ref(combineFlightsByDate(flights.value, previousFlights.value)).value
  pending.value = false
}

async function fetchNext() {
  pending.value = true
  page.value = page.value + 1
  let { data:nextFlights } = await useLazyFetch(`/api/get_departures_flights?page=${page.value}`)
  if (nextFlights.value.page.current == nextFlights.value.page.total) {
    disabledNextFlights.value = true
  }
  flights.value.data = ref(combineFlightsByDate(flights.value, nextFlights.value)).value
  pending.value = false
}

function combineFlightsByDate(flightsByDate1, flightsByDate2) {
  
  const flightsByDate1Object = JSON.parse(JSON.stringify(flightsByDate1)).data
  const flightsByDate2Object = JSON.parse(JSON.stringify(flightsByDate2)).data

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

function groupEvents(eventsByDate) {
  const events = [];

  for (let key in eventsByDate) {
    eventsByDate[key].forEach(event => {
      events.push(event);
    });
  }

  return events;
}

const selectedSearch = (async (item) => {
  const { data:flightsSearch } = await useLazyFetch(`/api/search_flight?search=${item}`)

  searchFlights.value = flightsSearch.value
})

const selectFlight = ((item) => {
  console.log(item)
})

const refresh = () => refreshNuxtData()

const intervalDuration = 180000
const timeLeft = ref(intervalDuration)

setInterval(() => {
  timeLeft.value = intervalDuration;
  disabledPreviousFlights.value = false
  disabledNextFlights.value = true
  refresh()
}, intervalDuration)

const intervalTimer = setInterval(() => {
    timeLeft.value = timeLeft.value - 1000;
    if (timeLeft.value <= 0) {
      clearInterval(intervalTimer);
    }
  }, 1000);
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn block @click="refresh()">Rafraîchir ({{ Math.floor(timeLeft / 1000) }}/180 secondes)</v-btn>
      </v-col>
      <v-col>
        <v-autocomplete
          v-if="!pending"
          v-model="autocomplete"
          label="Chercher un vol"
          variant="solo"
          dense
          @update:search="selectedSearch"
          @update:model-value="selectFlight"
          item-title="id"
          return-object
          :items="searchFlights?.results"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn :disabled="pending || disabledPreviousFlights" block @click="fetchPrevious()">
          Afficher des anciens vols
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="pending">
      <v-col class="text-center">
        <v-progress-circular indeterminate :size="128"></v-progress-circular>
      </v-col>
    </v-row>
    <div v-if="flights?.data">
      <v-row v-for="(flights_date, name) in flights.data">
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
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text !== 'canceled'">Départ <span class="text-green">{{ new Date(flight.flight.time.scheduled.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.scheduled.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text !== 'canceled' && flight.flight.status.generic.status.text == 'estimated'">Décollage prévu à <span class="text-orange">{{ new Date(flight.flight.time.estimated.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.estimated.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text !== 'canceled'">Arrivée <span class="text-green">{{ new Date(flight.flight.time.scheduled.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.scheduled.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'canceled'" class="text-black text-red">Annulée</v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'delayed'">Prévu à {{ new Date(flight.flight.time.estimated?.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.estimated.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</v-card-subtitle>
                  <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'estimated'">Estimée à <span class="text-orange">{{ new Date(flight.flight.time.scheduled?.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.scheduled.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
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
                    {{ flight.flight.airport.destination.name }} ({{ flight.flight.airport.destination.code?.iata }})
                  </v-card-title>

                  <v-card-subtitle>
                    {{ flight.flight.identification.number.default }} ({{ flight.flight.aircraft.model.code }} | {{ flight.flight.aircraft.model.text }})
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn v-if="flight.flight.identification.id" variant="tonal" nuxt :to="`/flight/${flight.flight.identification.id}`">Plus d'information</v-btn>
                  </v-card-actions>
                </div>
              </div>
            </v-card>
            <v-progress-linear :color="flight.flight.status.generic.status.color" model-value="100" :height="7"></v-progress-linear>
          <!-- {{ new Date(flight.flight.time.scheduled.arrival * 1000) }} | {{ flight.flight.airport.origin.name }} to Nice -->
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col>
        <v-btn :disabled="pending || disabledNextFlights" block @click="fetchNext()">
          Afficher des nouveaux vols
        </v-btn>
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