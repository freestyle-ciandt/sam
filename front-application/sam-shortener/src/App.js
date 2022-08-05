import './App.css';

import { useRef } from 'react';
import axios from 'axios'

function App() {
  const userUrl = window.location.href
  const queryParams = new URLSearchParams(window.location.hash.replace('#','?'));
  const userIdToken =  queryParams.get('id_token');
  const inputUrl = useRef(null);
  const url = 'https://dojo.am.fs.citko.net/shortenurl'

  const urlShortener = async () => {
    console.log(inputUrl.current.value)
    console.log('id:', userIdToken)

    const urlToShort = inputUrl.current.value

    // https://dojo.am.fs.citko.net/shortenurl -H "Authorization: <id_token>" -d '{"data": {"url": "http://abc.com.br"}}'
    const data = {
      data: {
        url : urlToShort
      }
    }

    const config = {
      headers: {
        'Authorization': userIdToken
      },
    }

    try {
      const response = await axios.post(url, data, config)
      console.log('response', response)
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <a href={`https://mando-agatha-ex5.auth.us-east-1.amazoncognito.com/login?client_id=5g9q8scbpjvo3543csp9ttktqb&response_type=token&redirect_uri=${userUrl}`}>
        <button>Login</button>
        </a>
        <input ref={inputUrl}></input>
        <button onClick={urlShortener}>Save</button>
      </header>
    </div>
  );
}

export default App;
