import axios from 'axios'

const headers = {
  "accept-encoding": "json",
  "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "cache-control": "max-age=0",
  "origin": "https://www.flightradar24.com",
  "referer": "https://www.flightradar24.com/",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json"
}

export default defineEventHandler(async (event) => {

  const query = getQuery(event)

  if (!query.page) {
    query.page = 1
  }

  if (!query.limit) {
    query.limit = 100
  }

  const date = new Date().getTime()

  let flight_list = [];

  try {
    const response = await axios.get(
      `https://api.flightradar24.com/common/v1/airport.json?code=nce&plugin[]=schedule&plugin-setting[schedule][mode]=departures&plugin-setting[schedule][timestamp]=${date / 1000}&page=${query.page}&limit=${query.limit}&token=`,
      {
        header: headers
      }
    )

    const data = response.data.result.response.airport.pluginData.schedule

    if (query.terminal) {
      for (let flight of data.departures.data) {
        console
        let terminal = flight.flight.airport.destination.info.terminal;
      
        if (terminal === query.terminal || terminal === 'None') {
          flight_list.push(flight);
        }
      }
      data.departures.data = flight_list
    }

    let flights_departures_by_date = {};

    for (let flight_departure of data.departures.data) {
      let flight_departure_timestamp = flight_departure.flight.time.scheduled.departure;
      
      let flight_departure_date = new Date(flight_departure_timestamp * 1000);
      let flight_departure_datetime = new Date(flight_departure_date).setHours(0,0,0,0);
      flight_departure_timestamp = Math.floor(flight_departure_datetime / 1000);

      if (!(flight_departure_timestamp in flights_departures_by_date)) {
        flights_departures_by_date[flight_departure_timestamp] = [];
      }
      
      flights_departures_by_date[flight_departure_timestamp].push(flight_departure);
    }

    data.departures.data = flights_departures_by_date

    return data.departures
  } catch (error) {
    return error
  }
})

