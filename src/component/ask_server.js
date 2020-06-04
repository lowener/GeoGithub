
export async function get_places(repository) {
    const SERVER_URL_PATH = '/ask' ///'http://localhost:8080/ask'
    const bodystr = JSON.stringify(repository)
    return (async () => {
      const rawResponse = await fetch(SERVER_URL_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: bodystr
      });
      const content = await rawResponse.json();
      console.log(content)
      return await get_countries(content.locations)
    })();
}

async function get_countries(places) {
  var new_places = places.map(async place => {
    const SERVER_URL_PATH = '/get_country'//'http://localhost:8080/get_country'//https://mapviz-lowener.herokuapp.com
    var x =  await (async () => {
      const rawResponse = await fetch(SERVER_URL_PATH + '/' + place, {method: 'GET'});
      const content = await rawResponse.json();
      return content.CountryCode
    })();
    /*
    "Country": country,
    "CountryCode": countryCode
    */
    return x
  })
  return Promise.all(new_places)
}