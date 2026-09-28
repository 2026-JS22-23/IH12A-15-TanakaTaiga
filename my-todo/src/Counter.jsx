import { useState } from "react";
import "./App.css";

export default function Counter() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>クリック回数: {count}</p>
            <button onClick={() => setCount((c) => c + 1)}>クリック回数: {count}</button>
        </div>
    );
}
