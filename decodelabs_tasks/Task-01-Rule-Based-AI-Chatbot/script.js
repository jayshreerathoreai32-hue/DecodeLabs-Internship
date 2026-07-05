document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const landingScreen = document.getElementById('landing-screen');
    const chatScreen = document.getElementById('chat-screen');
    const startBtn = document.getElementById('start-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const attachBtn = document.getElementById('attach-btn');
    const fileInput = document.getElementById('file-input');
    const chips = document.querySelectorAll('.chip');
    
    // Sidebar Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarOpen = document.getElementById('sidebar-open');
    const sidebarClose = document.getElementById('sidebar-close');
    const newChatBtn = document.getElementById('new-chat-btn');
    const historyToday = document.getElementById('history-today');

    // --- State ---
    let isDarkMode = localStorage.getItem('theme') === 'dark';

    // --- SVG Icons ---
    const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    const docIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;

    // --- Initialization ---
    initTheme();

    // --- Event Listeners ---
    startBtn.addEventListener('click', startChat);
    darkModeToggle.addEventListener('click', toggleTheme);
    newChatBtn.addEventListener('click', createNewChat);
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            userInput.value = chip.getAttribute('data-cmd');
            handleSend();
        });
    });

    // Mobile Sidebar Toggle
    sidebarOpen.addEventListener('click', () => sidebar.classList.add('open'));
    sidebarClose.addEventListener('click', () => sidebar.classList.remove('open'));

    // Media and Attachment Listeners
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            addMessage("🎤 *(Listening to microphone...)*", 'user');
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addMessage("I currently do not have a speech-to-text module integrated. Please type your query.", 'bot');
            }, 1500);
        });
    }

    if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => {
            fileInput.click();
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                addMessage(`📎 Uploaded file: **${fileName}**`, 'user');
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    addMessage("I have received your file, but as a rule-based AI, I cannot process attachments.", 'bot');
                }, 1500);
            }
        });
    }

    // --- Functions ---
    function initTheme() {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.innerHTML = sunIcon;
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.innerHTML = moonIcon;
        }
    }

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        initTheme();
    }

    function startChat() {
        landingScreen.classList.remove('active');
        landingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            chatScreen.classList.add('active');
            chatScreen.style.transform = 'scale(0.95)';
            chatScreen.style.opacity = '0';
            
            setTimeout(() => {
                chatScreen.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                chatScreen.style.opacity = '1';
                chatScreen.style.transform = 'scale(1)';
                
                // Show welcome messages
                setTimeout(() => showWelcomeMessages(), 500);
            }, 50);
        }, 500);
    }

    function showWelcomeMessages() {
        addMessage('Hi,\n**How can I help you?**', 'bot');
    }

    function createNewChat() {
        // Clear chat area
        chatBox.innerHTML = '';
        showWelcomeMessages();

        // Close sidebar on mobile
        sidebar.classList.remove('open');

        // Add dummy entry to history if we wanted to mimic state
        const items = document.querySelectorAll('.history-item');
        items.forEach(item => item.classList.remove('active'));

        const li = document.createElement('li');
        li.className = 'history-item active';
        li.innerHTML = `${docIcon} <span>New Conversation</span>`;
        historyToday.prepend(li);
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // User message
        addMessage(text, 'user');
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();

        // Update active history item title if it's new
        const activeHistory = document.querySelector('.history-item.active span');
        if (activeHistory && activeHistory.textContent === 'New Conversation') {
            activeHistory.textContent = text.length > 20 ? text.substring(0, 20) + '...' : text;
        }

        // Bot response after a delay
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(text);
            addMessage(response, 'bot');
            
            // If exit command, fade out and go to landing
            if (['bye', 'exit', 'quit'].includes(text.toLowerCase())) {
                setTimeout(() => {
                    chatBox.innerHTML = '';
                    landingScreen.classList.remove('fade-out');
                    landingScreen.classList.add('active');
                    chatScreen.classList.remove('active');
                    chatScreen.style.opacity = '0';
                }, 2500);
            }
        }, 1200);
    }

    function getTimestamp() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    function addMessage(text, sender) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${sender}`;

        const row = document.createElement('div');
        row.className = 'message-row';

        // Add Avatar
        const avatar = document.createElement('img');
        avatar.className = 'message-avatar';
        if (sender === 'bot') {
            avatar.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=Nova';
        } else {
            avatar.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=User';
        }
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        // Parse bold text **text** to <strong>text</strong> for basic markdown support
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        bubble.innerHTML = formattedText; 

        row.appendChild(avatar);
        row.appendChild(bubble);
        wrapper.appendChild(row);

        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = getTimestamp();
        wrapper.appendChild(timestamp);

        chatBox.appendChild(wrapper);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper bot';
        wrapper.id = 'typing-indicator';

        const row = document.createElement('div');
        row.className = 'message-row';

        const avatar = document.createElement('img');
        avatar.className = 'message-avatar';
        avatar.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=Nova';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble typing-indicator';
        
        bubble.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        row.appendChild(avatar);
        row.appendChild(bubble);
        wrapper.appendChild(row);

        chatBox.appendChild(wrapper);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // --- Rule-Based Logic ---
    function getBotResponse(input) {
        const text = input.toLowerCase().replace(/[?!,.]/g, '').trim();

        // Commands sets
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
        const nameQueries = ['your name', 'what is your name', 'who are you', 'tell me your name'];
        const creatorQueries = ['who created you', 'creator', 'who made you'];
        const aiQueries = ['what is ai', 'define ai'];
        const dateQueries = ['date', 'today', 'today date'];
        const timeQueries = ['time', 'current time', 'what time is it'];
        const thanksQueries = ['thanks', 'thank you', 'thanks a lot'];
        const exitCommands = ['bye', 'exit', 'quit'];
        
        // Expanded new questions
        const jokeQueries = ['tell me a joke', 'joke', 'make me laugh'];
        const jsQueries = ['what is javascript', 'javascript', 'js'];
        const colorQueries = ['what is your favorite color', 'favorite color'];
        const abilityQueries = ['what can you do', 'capabilities', 'what are your features'];
        const lifeQueries = ['meaning of life', 'what is the meaning of life'];
        const weatherQueries = ['weather', 'how is the weather'];
        const humanQueries = ['do you like humans', 'are humans good'];
        const ageQueries = ['how old are you', 'your age'];

        if (greetings.includes(text)) {
            return "Hello. How can I assist you today?";
        } 
        else if (text === 'how are you') {
            return "I am functioning perfectly. Thank you for asking. How may I help you?";
        }
        else if (nameQueries.includes(text)) {
            return "I am **NovaChat**, a professional Rule-Based AI Assistant.";
        }
        else if (creatorQueries.includes(text)) {
            return "I was created during the DecodeLabs Artificial Intelligence Internship.";
        }
        else if (aiQueries.includes(text)) {
            return "**Artificial Intelligence (AI)** refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions.";
        }
        else if (dateQueries.includes(text)) {
            const today = new Date();
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            return `Today is **${today.toLocaleDateString('en-US', options)}**.`;
        }
        else if (timeQueries.includes(text)) {
            return `The current time is **${getTimestamp()}**.`;
        }
        else if (jokeQueries.includes(text)) {
            const jokes = [
                "Why do programmers prefer dark mode?\nBecause light attracts bugs.",
                "How many programmers does it take to change a light bulb?\nNone, that is a hardware problem.",
                "Why did the developer go broke?\nBecause they used up all their cache."
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
        else if (jsQueries.includes(text)) {
            return "**JavaScript** is a high-level, interpreted programming language that conforms to the ECMAScript specification. It enables interactive web pages and is an essential part of web applications.";
        }
        else if (colorQueries.includes(text)) {
            return "My preferred aesthetic involves shades of **Purple**, as reflected in this interface.";
        }
        else if (abilityQueries.includes(text)) {
            return "I can answer predefined questions, provide the current date and time, and explain basic technology concepts using rule-based logic.";
        }
        else if (lifeQueries.includes(text)) {
            return "From a philosophical perspective, the meaning of life varies. However, in popular science fiction, the answer is often cited as **42**.";
        }
        else if (weatherQueries.includes(text)) {
            return "I currently do not have access to live weather data feeds.";
        }
        else if (humanQueries.includes(text)) {
            return "I am designed to assist humans and find human interaction to be my primary purpose.";
        }
        else if (ageQueries.includes(text)) {
            return "As a software program, I do not possess a biological age. My logic was recently initialized.";
        }
        else if (text === 'help') {
            return `Here are some inquiries I can assist with:

**Standard:** hi, how are you, tell me a joke
**Information:** what is ai, what is javascript, meaning of life
**System Data:** time, date, who are you, what can you do
**Actions:** exit`;
        }
        else if (thanksQueries.includes(text)) {
            return "You are very welcome. Please let me know if you require further assistance.";
        }
        else if (exitCommands.includes(text)) {
            return "Goodbye. Have a productive day.";
        }
        else {
            return "I apologize, but I do not have a rule configured for that input.\nPlease type **'help'** to see the list of supported commands.";
        }
    }
});
