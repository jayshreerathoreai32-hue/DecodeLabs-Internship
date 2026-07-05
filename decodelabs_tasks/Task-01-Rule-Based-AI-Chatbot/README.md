# 🤖 NovaChat AI - Rule-Based Chatbot

**Project 1 - DecodeLabs Artificial Intelligence Internship**

## 📖 Objective
The objective of this project is to build a rule-based AI chatbot that responds to predefined user inputs using decision-making logic. The project demonstrates the core fundamentals of control flow and user interaction, and it is presented in two distinct formats:
1. **A Professional Web Application** (`index.html`, `style.css`, `script.js`)
2. **A Python Terminal Application** (`chatbot.py`)

---

## ✨ Features

### Web Interface (NovaChat Theme)
- **Modern UI Design:** A sleek, premium, dark-purple aesthetic with a floating chat card layout.
- **Responsive Sidebar:** Includes a chat history sidebar that gracefully collapses into a mobile-friendly hamburger menu on smaller screens.
- **Dark/Light Mode:** Toggle between themes seamlessly, with your preference saved automatically using `localStorage`.
- **Simulated Media Inputs:** Mock microphone and file upload integrations to demonstrate advanced UI capabilities.
- **Quick Action Chips:** Clickable command suggestions for fast interactions.

### Bot Capabilities (Rule-Based Logic)
Both the Web and Python versions can understand and respond to:
- **Greetings:** `hi`, `hello`, `good morning`, etc.
- **Conversational Queries:** `how are you?`, `tell me a joke`, `meaning of life`.
- **Information Queries:** `what is ai?`, `what is javascript?`.
- **System Queries:** `time`, `date`, `who created you?`.
- **Action Commands:** `help`, `clear`, `exit`, `bye`.

---

## 🛠️ Project Structure

```text
Task-01-Rule-Based-AI-Chatbot/
├── index.html           # Web application layout (HTML5)
├── style.css            # Custom styling & themes
├── script.js            # Rule-based JS logic & UI interactions
├── chatbot.py           # Python terminal version
├── requirements.txt     # Python dependencies (None required)
├── README.md            # Project documentation
└── screenshots/         # UI demonstrations
```

---

## 🚀 How to Run

### Web Version (Recommended)
No installation or backend required! The web app runs entirely on the client-side.
1. Navigate to the project folder.
2. Double-click **`index.html`** to open it in your default web browser.
3. *Alternatively, use an extension like VS Code Live Server.*

### Python Terminal Version
1. Ensure Python 3.x is installed on your system.
2. Open your terminal in the `Task-01-Rule-Based-AI-Chatbot` directory.
3. Run the following command:
   ```bash
   python chatbot.py
   ```

---

## 🧠 Learning Outcomes
By completing this project, the following skills were demonstrated:
- **Rule-Based Architecture:** Implementing `if-else` decision trees to map specific user inputs to predefined outputs.
- **Frontend Web Development:** Building a highly responsive, multi-layout web application using Vanilla HTML, CSS, and JS without frameworks.
- **State Management:** Handling dark mode persistence and dynamic DOM manipulation for chat history logs.
- **String Manipulation:** Sanitizing and formatting user inputs (removing punctuation, handling casing) to ensure accurate logic matching.

---

**Author:** Artificial Intelligence  
*DecodeLabs Artificial Intelligence Internship - Project 1*