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

  const date = new Date().getTime()


  try {
    const response = await axios.get(
      `https://api.flightradar24.com/common/v1/airport.json?code=nce&plugin[]=schedule&plugin-setting[schedule][timestamp]=${date / 1000}&page=${query.page}&limit=100&token=`,
      {
        header: headers
      }
    )

    let results = []

    const data = response.data.result.response.airport.pluginData.schedule

    // Rercherche dans les arrivées
    for (var i = 0; i < data.arrivals.data.length; i++) {
      if (data.arrivals.data[i].flight.identification.number.default) {
        const code = data.arrivals.data[i].flight.identification.number.default.toLowerCase();

        if (code.includes(query.code.toLowerCase())) {
          results.push(data.arrivals.data[i]);
        }
      }
    }

    if (!results[0]) {
      const searchFlight = await axios.get(
        `https://data-live.flightradar24.com/clickhandler/?version=1.5&flight=${query.code}`,
        {
          header: headers
        }
      )

      return searchFlight.data
    }

    return results[0].flight
  } catch (error) {
    return error
  }
})

