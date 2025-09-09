import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  // After rendering this component, go fetch the message from the server once then update the screen
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return <p>{message}</p>;
}

export default App;
