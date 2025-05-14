import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";

function App() {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  let recognition = null;
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("El navegador no soporta SpeechRecognition");
      return;
    }
    recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = true; // Mostrar resultados parciales
    recognition.maxAlternatives = 1;
    recognition.continuous = true; // Reconocimiento continuo
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      console.log("Texto hablado:", text);
      //mandarlo al backend con Ollama
    };

    recognition.onend = () => {
      console.log("Reconocimiento de voz detenido");
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
    console.log("Reconocimiento de voz iniciado");
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      recognition = null;
      setIsListening(false);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  const handleClickButton = () => {
    const input = inputRef.current;
    const value = input.value;

    //peticion al back para la query
    const fetchAskQuery = async (value) => {
      const apicall = await fetch("http://localhost:3000/ask-query", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ query: value, messages: messages }),
      });
      const res = await apicall.json();
      console.log(res);
      //actualizamos mensajes con lo que el user escribe
      //actualizamos mensajes con lo que el asistente dice
      setMessages([
        ...messages,
        { role: "user", content: value },
        { role: "assistant", content: res.reply },
      ]);

      //habla diciendo el mensaje
      speak(res.reply);
    };
    fetchAskQuery(value);
  };
  return (
    <>
      <div className="conversation">
        {messages.map((message) => (
          <p
            className={`message ${message.role === "user" ? "right" : "left"}`}
          >
            {message.content}
          </p>
        ))}
      </div>
      <div className="card">
        <input ref={inputRef} type="text" placeholder="mensaje"></input>
        <button onClick={handleClickButton}>Enviar</button>
        <button onClick={startListening}>hablar</button>
      </div>
      {/* PRUEBA POR VOS */}
      <div>
        <h2>Reconocimiento de Voz</h2>
        <button onClick={startListening} disabled={isListening}>
          Iniciar Reconocimiento
        </button>
        <button onClick={stopListening} disabled={!isListening}>
          Detener Reconocimiento
        </button>
        <p>Texto reconocido: {transcript}</p>
      </div>
    </>
  );
}

export default App;
