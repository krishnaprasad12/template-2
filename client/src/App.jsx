import "./App.css";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import GetStarted from "./components/GetStarted/GetStarted";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import Value from "./components/Value/Value";
import React, { useState } from 'react';

function App() {
  // Global state to manage admin status
  const [isAdmin, setIsAdmin] = useState(false); // Global admin state

  return (
    <div className="App">
      <div>
        <Header isAdmin = {isAdmin}/>
        <Hero isAdmin = {isAdmin}/>
        <Products isAdmin = {isAdmin} />
        <Value isAdmin = {isAdmin} />
        <Contact isAdmin={isAdmin} />
        <GetStarted isAdmin = {isAdmin} />
        <Footer setIsAdmin={setIsAdmin} /> {/* Passing setIsAdmin */}
      </div>
    </div>
  );
}

export default App;
