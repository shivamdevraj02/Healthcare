import { useEffect, useRef, useState } from "react";
import api from "../services/api";

// Floating voice + text assistant widget.
// Uses the browser's native Web Speech API (SpeechRecognition + SpeechSynthesis) —
// no API key or external service needed. Falls back to text-only if the browser
// doesn't support speech recognition (e.g. Firefox).

export default function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me about appointments, symptoms, reminders, doctors, or a medicine name — by typing or tapping the mic." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Mirrors `open` for use inside async callbacks (state is stale in closures)
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Speech recognition (voice input) setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript, true);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Speech synthesis (voice output) — load available voices for the picker
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length) {
        setVoices(list);
        const stored = localStorage.getItem("ss_voice_uri");
        const preferred =
          list.find((v) => v.voiceURI === stored) ||
          list.find((v) => v.lang?.toLowerCase().includes("en-in")) ||
          list.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
          list[0];
        setSelectedVoiceURI(preferred?.voiceURI || "");
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, open]);

  // Stop everything the moment the component unmounts, just in case
  useEffect(() => {
    return () => stopSpeaking();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const speak = (text) => {
    if (!voiceReplyEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const chosen = voices.find((v) => v.voiceURI === selectedVoiceURI);
    if (chosen) {
      utterance.voice = chosen;
      utterance.lang = chosen.lang;
    } else {
      utterance.lang = "en-IN";
    }
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceChange = (uri) => {
    setSelectedVoiceURI(uri);
    localStorage.setItem("ss_voice_uri", uri);
    const chosen = voices.find((v) => v.voiceURI === uri);
    if (chosen && "speechSynthesis" in window) {
      const preview = new SpeechSynthesisUtterance("This is how I sound now.");
      preview.voice = chosen;
      preview.lang = chosen.lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(preview);
    }
  };

  const handleSend = async (text, fromVoice = false) => {
    const messageText = (text ?? input).trim();
    if (!messageText) return;

    setMessages((prev) => [...prev, { from: "user", text: messageText }]);
    setInput("");

    // Abort any previous in-flight request before starting a new one
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsTyping(true);

    try {
      const res = await api.post(
        "/chatbot/message",
        { message: messageText },
        { signal: controller.signal }
      );

      // If the widget was closed while we were waiting for this response,
      // don't show it or speak it.
      if (!openRef.current) return;

      const reply = res.data.reply;

      // Small human-like "thinking" delay before the reply actually appears
      const delay = 700 + Math.random() * 700; // ~0.7s – 1.4s
      typingTimeoutRef.current = setTimeout(() => {
        if (!openRef.current) return;
        setIsTyping(false);
        setMessages((prev) => [...prev, { from: "bot", text: reply }]);
        if (fromVoice) speak(reply);
      }, delay);
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        setIsTyping(false);
        return;
      }
      if (!openRef.current) return;
      setIsTyping(false);
      const errText = "Sorry, I couldn't reach the server. Please try again.";
      setMessages((prev) => [...prev, { from: "bot", text: errText }]);
    }
  };

  const toggleListening = () => {
    if (!speechSupported) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  // Stop any ongoing speech, listening, pending request, and pending reply —
  // called the instant the assistant is closed.
  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Chrome sometimes ignores a cancel() called mid-utterance and only
      // stops after the current sentence finishes. A second cancel() on the
      // next tick reliably kills it right away.
      setTimeout(() => window.speechSynthesis.cancel(), 0);
    }
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setIsTyping(false);
  };

  const closeAssistant = () => {
    openRef.current = false; // set synchronously so any in-flight response sees it immediately
    stopSpeaking();
    setOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {open && (
        <div className="mb-3 w-80 max-w-[90vw] h-[28rem] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-brand-600 text-white px-4 py-3 flex items-center justify-between relative">
            <div>
              <p className="font-semibold text-sm">SwasthSetu Assistant</p>
              <p className="text-xs text-brand-100">{listening ? "Listening..." : "Ask by voice or text"}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                title="Change voice"
                onClick={() => setShowVoicePicker((v) => !v)}
                className="text-white/80 hover:text-white text-sm"
              >
                🗣️
              </button>
              <button
                title={voiceReplyEnabled ? "Voice replies on" : "Voice replies off"}
                onClick={() => setVoiceReplyEnabled((v) => !v)}
                className="text-white/80 hover:text-white text-sm"
              >
                {voiceReplyEnabled ? "🔊" : "🔇"}
              </button>
              <button onClick={closeAssistant} className="text-white/80 hover:text-white text-sm">✕</button>
            </div>

            {showVoicePicker && (
              <div className="absolute top-full right-2 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-10">
                <p className="text-xs text-slate-500 px-1 pb-1">Choose reply voice</p>
                {voices.length ? (
                  <select
                    className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 outline-none"
                    value={selectedVoiceURI}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                  >
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-400 px-1">No voices found on this browser/device.</p>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] text-sm px-3 py-2 rounded-xl ${
                  m.from === "user"
                    ? "bg-brand-500 text-white ml-auto rounded-br-sm"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div className="max-w-[60%] bg-white border border-slate-200 text-slate-400 rounded-xl rounded-bl-sm px-3 py-2 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-2 border-t border-slate-100 flex items-center gap-2 bg-white"
          >
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm shrink-0 ${
                  listening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 text-slate-600"
                }`}
                title="Tap to speak"
              >
                🎙️
              </button>
            )}
            <input
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white text-sm px-3 py-2 rounded-xl shrink-0">
              Send
            </button>
          </form>
          {!speechSupported && (
            <p className="text-[11px] text-slate-400 px-3 pb-2">Voice input isn't supported in this browser — try Chrome/Edge.</p>
          )}
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => (open ? closeAssistant() : setOpen(true))}
        className="w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-xl flex items-center justify-center text-2xl transition-transform hover:scale-105"
        aria-label="Open voice assistant"
      >
        {open ? "✕" : "🎙️"}
      </button>
    </div>
  );
}