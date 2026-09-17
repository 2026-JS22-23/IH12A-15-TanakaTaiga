import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

function TodoItem({ text}) {
  return <li>{text}</li>;
}

export default function App() {
  const items= ['牛乳を買う', 'レポート提出'];
  return (
    <ul>
      {items.map((todoText,i)=><TodoItem key={i} text={todoText}/>)}
    </ul>
  );
}

