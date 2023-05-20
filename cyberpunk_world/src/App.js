import logo from './logo.svg';
import './App.css';
import React from 'react';
import MyScene from './scene.js';

const App = () => {
  return (
    <div>
      <h1>Welcome to My Website</h1>
      <p>This is some content...</p>
      <MyScene />
      <p>More content...</p>
    </div>
  );
};

export default App;