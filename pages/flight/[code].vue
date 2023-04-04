<script setup>
const route = useRoute()

const { pending, data:flight, refresh } = await useLazyFetch(`/api/get_flight_by_code?code=${route.params.code}`)


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
    </v-row>
    <v-row v-if="!pending && flight">
      <v-col>
        <v-card
            flat
            rounded="0"
            variant="outlined"
          >
          <v-card-title>
            {{ flight.identification.number.default }}
          </v-card-title>
          <v-card-subtitle>
            Status: {{ flight.status.generic.status.text }}<br />
            Type: {{ flight.status.generic.status.type }}
          </v-card-subtitle>
          <v-card-text>
            <div>
              <v-card-subtitle v-if="flight.status.generic.status.text == 'scheduled'">Départ <span class="text-green">{{ new Date(flight.time.scheduled.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.scheduled.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
              <v-card-subtitle v-if="flight.status.generic.status.text == 'estimated' || flight.status.generic.status.text == 'landed' || flight.status.generic.status.text == 'delayed'">Décollage <span class="text-orange">{{ new Date(flight.time.real.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.real.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
              <v-card-subtitle v-if="flight.status.generic.status.text == 'scheduled'">Arrivée <span class="text-green">{{ new Date(flight.time.scheduled.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.scheduled.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
              <v-card-subtitle v-if="flight.status.generic.status.text == 'canceled'" class="text-black text-red">Annulée</v-card-subtitle>
              <v-card-subtitle v-if="flight.status.generic.status.text == 'delayed'">Prévu à {{ new Date(flight.time.estimated?.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.estimated.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</v-card-subtitle>
              <v-card-subtitle v-if="flight.status.generic.status.text == 'estimated'">Estimée à <span class="text-orange">{{ new Date(flight.time.estimated.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.estimated.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
              <v-card-subtitle v-if="flight.status.generic.status.text == 'landed'">Arrivée à <span class="text-green">{{ new Date(flight.time.real.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.real.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></v-card-subtitle>
            </div>
          </v-card-text>
        </v-card>
        <v-progress-linear :color="flight.status.generic.status.color" model-value="100" :height="7"></v-progress-linear>
      </v-col>
      <v-col v-if="flight.aircraft?.images">
        <v-card>
          <v-carousel>
            <v-carousel-item
              v-for="flightPicture in flight.aircraft.images.large"
              :src="flightPicture.src"
              cover
            ></v-carousel-item>
          </v-carousel>
        </v-card>
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