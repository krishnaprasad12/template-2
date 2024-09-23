import "./App.css";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import GetStarted from "./components/GetStarted/GetStarted";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Residencies from "./components/Residencies/Residencies";
import Value from "./components/Value/Value";
import React, { useState } from 'react';

function App() {
  // Global state to manage admin status
  const [isAdmin, setIsAdmin] = useState(false); // Global admin state

  return (
    <div className="App">
      <div>
        <Header />
        <Hero />
        <Residencies />
        <Value isAdmin = {isAdmin} />
        <Contact isAdmin={isAdmin} />
        <GetStarted />
        <Footer setIsAdmin={setIsAdmin} /> {/* Passing setIsAdmin */}
      </div>
    </div>
  );
}

export default App;
