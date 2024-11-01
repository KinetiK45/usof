import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from "./router/AppRoutes";
import '../src/pages/css/Main.css';

function App() {
  return (
    <div className="App-header">
        {
            ReactDOM.render(
                <Router>
                    <AppRoutes />
                </Router>,
                document.getElementById('root')
            )
        }
    </div>
  );
}

export default App;
