<script setup>
const route = useRoute()

const config = useRuntimeConfig()
const { pending, data:flight, refresh } = await useLazyFetch(`${config.public.apiBase}/get_flight?id=${route.params.code}`)

setTimeout(() => {
  refresh()
}, "300000")
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn block @click="refresh()">Refresh</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="!pending && flight">
      <v-col>
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
    <v-row v-if="!pending && flight">
      <v-col>
        <div>
          <div v-if="flight.status.generic.status.text !== 'canceled' && flight.status.generic.status.text == 'scheduled'">Départ <span class="text-green">{{ new Date(flight.time.scheduled.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.scheduled.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></div>
          <div v-if="flight.status.generic.status.text !== 'canceled' && flight.status.generic.status.text == 'estimated'">Décollage <span class="text-orange">{{ new Date(flight.time.real.departure * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.real.departure * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.origin.timezone.name }).toString().padStart(2, '0') }}</span></div>
          <div v-if="flight.status.generic.status.text !== 'canceled'">Arrivée <span class="text-green">{{ new Date(flight.time.scheduled.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.scheduled.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></div>
          <div v-if="flight.status.generic.status.text == 'canceled'" class="text-black text-red">Annulée</div>
          <div v-if="flight.status.generic.status.text == 'delayed'">Prévu à {{ new Date(flight.time.estimated?.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.estimated.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</div>
          <div v-if="flight.status.generic.status.text == 'estimated'">Estimée à <span class="text-orange">{{ new Date(flight.time.estimated.arrival * 1000).getHours().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}:{{ new Date(flight.time.estimated.arrival * 1000).getMinutes().toLocaleString('fr-FR', { timezone: flight.airport.destination.timezone.name }).toString().padStart(2, '0') }}</span></div>
        </div>
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