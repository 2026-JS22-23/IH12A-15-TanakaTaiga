import { useState } from "react";
// import heroImg from "./assets/hero.png";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
import "./App.css";

// function TodoItem({ text }) {
// return <li>{text}</li>;
// }

export default function App() {
    const [todos, setTodos] = useState([]); // 変化するデータ
    const [text, setText] = useState("");
    const add = () => {
        if (!text.trim()) return;
        setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);
        setText("");
    };
    const toggle = (id) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    const remaining = todos.filter((t) => !t.done).length;
    const [count, setCount] = useState(0);
    return (
        <div>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <p>入力中: {text}</p>
            <button onClick={add}>追加</button>
            <button onClick={() => setTodos([])}>全削除</button>
            <ul>
                {todos.map((todo, i) => (
                    <li key={todo.id}>
                        {todo.text}
                        <button onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}>削除</button>
                    </li>
                ))}
            </ul>
            <p>残り {todos.length} 件</p>
            <button onClick={() => setCount((c) => c + 1)}>クリック回数: {count}</button>
        </div>
    );
}
