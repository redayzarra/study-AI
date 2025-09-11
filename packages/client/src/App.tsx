import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [message, setMessage] = useState("");

  // After rendering this component, go fetch the message from the server once then update the screen
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="p-4">
      <p className="font-bold p-4 text-3xl">{message}</p>
      <Button className="bg-black text-white cursor-pointer">Click me!</Button>
    </div>
  );
}

export default App;
