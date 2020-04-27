
export async function ask_server(repository) {
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
      return content
    })();
    /*const rawResponse =  fetch(SERVER_URL_PATH, {
      method: 'POST',
      headers: {
        'allowedOrigins': 'http://localhost',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: bodystr
    });

    return rawResponse;*/
}