const API_KEY = "ta_clé_api_ici"; // ← Mets ta vraie clé ici entre les guillemets

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function demarrerReconnaissance() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "fr-FR";
  recognition.start();

  recognition.onresult = function(event) {
    const texte = event.results[0][0].transcript;
    document.getElementById("userInput").value = texte;
    envoyerMessage();
  };

  recognition.onerror = function(event) {
    alert("Erreur de reconnaissance vocale : " + event.error);
  };
}

function parler(message) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "fr-FR";
  utterance.rate = 1;
  synth.speak(utterance);
}

function ajouterEmoji(emoji) {
  const input = document.getElementById("userInput");
  input.value += emoji;
  input.focus();
  autoResize(input);
}

async function générerRéponseAutomatique(question) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + API_KEY
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }]
    })
  });

  if (!response.ok) {
    return "Erreur d'accès à l'IA. Vérifie ta clé ou ta connexion.";
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function envoyerMessage() {
  const input = document.getElementById("userInput");
  const chatLog = document.getElementById("chatLog");
  const message = input.value.trim();

  if (!message) return;

  const userMsg = document.createElement("p");
  userMsg.className = "user-message";
  userMsg.innerHTML = "👤 Toi : " + message;
  chatLog.appendChild(userMsg);

  const botMsg = document.createElement("p");
  botMsg.className = "bot-message";
  botMsg.innerHTML = "🤖 Kelyonis : ...";
  chatLog.appendChild(botMsg);

  input.value = "";
  input.style.height = "120px";
  chatLog.scrollTop = chatLog.scrollHeight;

  const réponseIA = await générerRéponseAutomatique(message);
  botMsg.innerHTML = "🤖 Kelyonis : " + réponseIA;
  parler(réponseIA);
}
