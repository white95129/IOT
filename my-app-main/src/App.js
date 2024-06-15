
import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import axios from "axios";


import Nav from "./components/Nav";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  /*
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    axios.get("/api")
      .then(response => {setData(response.data);}
    ).catch(err => console.log(err))
  },[])
  */
  return (
    /*
    <div>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
    </div>
    */
    
    <div className="App">
     <Nav />
     <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/event" element={<About/>}/>
     </Routes>
    </div>
    
  );
}

export default App;
