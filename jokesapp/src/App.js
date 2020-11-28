import React, { useState, useEffect, useReducer } from "react";
import "./App.css";
import md5 from "md5";

function App() {
  const BASE_ENDPOINT = "https://gateway.marvel.com/";
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [imgRoute, setImgRoute] = useState();

  const ts = Date.now();
  const hash = md5(ts + process.env.REACT_APP_PRIVATE_K + process.env.REACT_APP_PUBLIC_K);

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("Name") !== null && localStorage.getItem("Description"))
      {
        setName(localStorage.getItem("Name"));
        setDescription(localStorage.getItem("Description"));
      }
      else 
        setName("loading...");
    } else {
      fetch(
        BASE_ENDPOINT +
          "/v1/public/characters?ts=" +
          ts +
          "&apikey=" +
          process.env.REACT_APP_PUBLIC_K +
          "&hash=" +
          hash
      )
        .then((res) => res.json())
        .then((data) => {
          const characters = data.data.results;
          let randomC = Math.floor(Math.random() * characters.length);
          let c = characters[randomC];
          setName(c.name);
          setDescription(c.description !== ""? c.description : "Not provided by the API" );
          setImgRoute(c.thumbnail.path+'/standard_xlarge.'+c.thumbnail.extension)
          localStorage.setItem("Name", c.name);
          localStorage.setItem("Description", c.description);
        });
    }
  }, []);

  return (
    <div className="App">
      <h1>Marvel heroes</h1>
      <br />
      <div>
        <h2>{name}</h2>
        <img src={imgRoute} alt="Hero portrait"/>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default App;
