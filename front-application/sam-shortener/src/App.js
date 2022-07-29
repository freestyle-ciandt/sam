import './App.css';

import { useRef } from 'react';

function App() {
  const userUrl = window.location.href
  const queryParams = new URLSearchParams(window.location.hash.replace('#','?'));
  const userIdToken =  queryParams.get('id_token');
  const inputUrl = useRef(null);
  const urlShortener = () => {
    console.log(inputUrl.current.value)
    console.log('id:',userIdToken)

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
