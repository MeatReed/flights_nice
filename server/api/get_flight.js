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

  if (!query.id) {
    return {
      "erreur": ""
    }
  }

  try {
    const response = await axios.get(
      `https://data-live.flightradar24.com/clickhandler/?version=1.5&flight=${query.id}`,
      {
        header: headers
      }
    )

    return response.data
  } catch (error) {
    return error
  }
})

