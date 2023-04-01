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

  const date = new Date().getTime()

  let flight_list = [];

  try {
    const response = await axios.get(
      `https://api.flightradar24.com/common/v1/airport.json?code=nce&plugin[]=schedule&plugin-setting[schedule][mode]=arrivals&plugin-setting[schedule][timestamp]=${date / 1000}&page=${query.page}&limit=100&token=`,
      {
        header: headers
      }
    )

    const data = response.data.result.response.airport.pluginData.schedule

    if (query.terminal) {
      for (let flight of data.arrivals.data) {
        let terminal = flight.flight.airport.destination.info.terminal;
      
        if (terminal === query.terminal || terminal === 'None') {
          flight_list.push(flight);
        }
      }
      data.arrivals.data = flight_list
    }

    let flights_arrivals_by_date = {};

    for (let flight_arrival of data.arrivals.data) {
      let flight_arrival_timestamp = flight_arrival.flight.time.scheduled.arrival;
      
      let flight_arrival_date = new Date(flight_arrival_timestamp * 1000);
      let flight_arrival_datetime = new Date(flight_arrival_date).setHours(0,0,0,0);
      flight_arrival_timestamp = Math.floor(flight_arrival_datetime / 1000);

      if (!(flight_arrival_timestamp in flights_arrivals_by_date)) {
        flights_arrivals_by_date[flight_arrival_timestamp] = [];
      }
      
      flights_arrivals_by_date[flight_arrival_timestamp].push(flight_arrival);
    }

    data.arrivals.data = flights_arrivals_by_date

    return data.arrivals
  } catch (error) {
    return error
  }
})

