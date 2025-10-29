// Simple client-side chatbot demo. Replace `getBotReply` with real API calls as needed.
const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");

document.addEventListener('DOMContentLoaded', setupAudio);

// Introduce the terminator corruption fucker! AAAAAAGGGGGGGHHHHHHHHH!
addBotMessage(
  "Hi — I'm Bataanx Engelnemen. A terminator to resolve the corruption in the Philippines! Peaceful protests are ineffective as the people on the top always get away!"
);

// event handlers
sendBtn.addEventListener("click", onSend);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    onSend();
  }
});

async function onSend() {
  const text = inputEl.value.trim();
  if (!text) return;
  addUserMessage(text);
  inputEl.value = "";
  status.textContent = "Brewing a revolution...";
  await simulateBotReply(text);
}

function addMessage(text, who = "bot") {
  const wrap = document.createElement("div");
  wrap.className = "msg " + (who === "bot" ? "bot" : "user");

  const sender = who === "bot" ? "Bataanx Engelnemen" : "You";

 wrap.innerHTML = `
        <div class="sender">${sender}</div> <hr/>
        <div class="content">${text}</div>
        <div class="meta">${new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        )}</div>
    `;
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addUserMessage(text) {
  addMessage(text, "user");
}
function addBotMessage(text) {
  addMessage(text, "bot");
  status.textContent = "Ready to start a revolution!";
}

// simulate typing with animated dots, then show reply
async function simulateBotReply(userText) {
  const typing = document.createElement("div");
  typing.className = "msg bot";
  typing.innerHTML = `<div class="content typing"><span class="dots"><span></span><span></span><span></span></span> Thinking of a revolution...</div>`;
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const reply = await getBotReply(userText);
  typing.remove();
  addBotMessage(reply);
}

async function getBotReply(text) {
  const t = text.toLowerCase();
  // const ai_response_message = text;
  const ai_response_message = await sendOpenAIRequest(t);
  return ai_response_message;
}

let _config = {
    openAI_api: "https://alcuino-chatbot.azurewebsites.net/api/OpenAIProxy",
    // openAI_api: "https://api.openai.com/v1/responses",
    openAI_model: "gpt-4o-mini",
    ai_instruction: `you are chatbot that would suggest solutions to the corruption in the Philippines. If the user doesn't ask about it, then advise him to ask relevant questions only and scold the user for not being patriotic,
        output should be in html format, 
        no markdown format, answer directly.`, //Prompt Engineering
    response_id: "",
};

// //if user ask an unrelated stuff then response accordingly.

async function sendOpenAIRequest(text) {
  let requestBody = {
    model: _config.openAI_model,
    input: text,
    instructions: _config.ai_instruction,
    previous_response_id: _config.response_id,
  }; //paper forms to send someone (openai)
  if (_config.response_id.length == 0) {
    requestBody = {
      model: _config.openAI_model,
      input: text,
      instructions: _config.ai_instruction,
    };
  }
  try {
    const response = await fetch(_config.openAI_api, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    let output = data.output[0].content[0].text;
    _config.response_id = data.id;

    return output;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

// Play the song "And The Battle Is Going Again!"
function setupAudio() {
    const audio = document.getElementById('backgroundMusic');
    
    audio.muted = false;
    let playAttempt = setInterval(() => {
        audio
            .play()
            .then(() => {
                clearInterval(playAttempt);
                audio.loop = true; // Loop the revolution! 
            })
            .catch(error => {
                console.log('Playback attempt failed:', error);
                // Show manual play button
                showPlayButton(audio);
            });
    }, 1000); // Retry every 1 second
}
