
export async function get_places(repository) {
    const SERVER_URL_PATH = 'http://localhost:8080/ask'
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
    const SERVER_URL_PATH = 'http://localhost:8080/get_country'
    var x =  await (async () => {
      const rawResponse = await fetch(SERVER_URL_PATH + '/' + place, {method: 'GET'});
      const content = await rawResponse.json();
      return content.country
    })();

    return x
  })
  return Promise.all(new_places)
/*
  var place = places[0]
  const SERVER_URL_PATH = 'http://localhost:8080/get_country'
  var x = (async () => {
    const rawResponse = await fetch(SERVER_URL_PATH + '/' + place, {method: 'GET'});
    const content = await rawResponse.json()
    return content
  })();
  places[0] = await x
  return places*/
}