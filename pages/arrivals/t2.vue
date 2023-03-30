<script setup>
const { pending, data: flights } = useLazyFetch('http://192.168.1.87:5000/get_arrivals_flights_t2')

const refresh = () => refreshNuxtData()

setTimeout(() => {
  refresh()
}, "300000");
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
    <v-row v-if="!pending && flights.arrivals">
      <v-col v-for="flight in flights.arrivals" cols="12">
        <v-card
          flat
          rounded="0"
          variant="outlined"
        >
            <div class="d-flex flex-no-wrap align-center">
              <div>
                <v-card-subtitle v-if="flight.flight.status.generic.status.text !== 'canceled' && flight.flight.status.generic.status.text == 'scheduled'">Départ <span class="text-green">{{ new Date(flight.flight.time.scheduled.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.scheduled.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                <v-card-subtitle v-if="flight.flight.status.generic.status.text !== 'canceled' && flight.flight.status.generic.status.text == 'estimated'">Décollage <span class="text-orange">{{ new Date(flight.flight.time.real.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.real.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                <v-card-subtitle v-if="flight.flight.status.generic.status.text !== 'canceled'">Arrivée <span class="text-green">{{ new Date(flight.flight.time.scheduled.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.scheduled.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
                <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'canceled'" class="text-black text-red">Annulée</v-card-subtitle>
                <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'delayed'">Prévu à {{ new Date(flight.flight.time.estimated?.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.estimated.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</v-card-subtitle>
                <v-card-subtitle v-if="flight.flight.status.generic.status.text == 'estimated'">Estimée à <span class="text-orange">{{ new Date(flight.flight.time.estimated.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.flight.time.estimated.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
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
                  <v-btn variant="tonal">Plus d'information</v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
          <v-progress-linear :color="flight.flight.status.generic.status.color" model-value="100" :height="7"></v-progress-linear>
        <!-- {{ new Date(flight.flight.time.scheduled.arrival * 1000) }} | {{ flight.flight.airport.origin.name }} to Nice -->
      </v-col>
    </v-row>
    <v-dialog>
      <v-card>
        
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>