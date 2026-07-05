"""
Rule-Based AI Chatbot
DecodeLabs Artificial Intelligence Internship
Project 1

Author: Artificial Intelligence

Description:
A simple rule-based chatbot that responds to predefined
user inputs using if-elif-else decision-making logic.
"""

from datetime import datetime


def chatbot():
    """Main chatbot function."""

    greetings = [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening"
    ]

    name_queries = [
        "your name",
        "what is your name",
        "who are you",
        "tell me your name"
    ]

    thanks_queries = [
        "thanks",
        "thank you",
        "thanks a lot"
    ]

    exit_commands = [
        "bye",
        "exit",
        "quit"
    ]

    print("=" * 60)
    print("          DecodeLabs Artificial Intelligence")
    print("               Rule-Based AI Chatbot")
    print("=" * 60)
    print("Hello! I am your Rule-Based AI Chatbot.")
    print("Type 'help' to view available commands.")
    print("Type 'bye' anytime to exit.\n")

    conversation_count = 1

    while True:

        user_input = input(f"You ({conversation_count}): ").strip().lower()

        # Remove punctuation
        for char in ["?", ".", "!", ","]:
            user_input = user_input.replace(char, "")

        # Greeting
        if user_input in greetings:
            print("Bot: Hello! Nice to meet you. How can I help you today?")

        # How are you
        elif user_input == "how are you":
            print("Bot: I'm doing great! Thank you for asking.")

        # Bot name
        elif user_input in name_queries:
            print("Bot: I am a Rule-Based AI Chatbot created for the DecodeLabs Artificial Intelligence Internship.")

        # Creator
        elif user_input in ["who created you", "creator"]:
            print("Bot: I was created as Project 1 for the DecodeLabs Artificial Intelligence Internship.")

        # AI
        elif user_input in ["what is ai", "define ai"]:
            print("Bot: AI stands for Artificial Intelligence. It enables computers to perform tasks that normally require human intelligence.")

        # Date
        elif user_input in ["date", "today", "today date"]:
            print(f"Bot: Today's date is {datetime.now().strftime('%d %B %Y')}.")

        # Time
        elif user_input in ["time", "current time"]:
            print(f"Bot: The current time is {datetime.now().strftime('%I:%M %p')}.")

        # Help
        elif user_input == "help":

            print("\n==================== HELP MENU ====================")
            print("Greeting")
            print("  hi")
            print("  hello")
            print("  hey")
            print("  good morning")
            print("  good afternoon")
            print("  good evening\n")

            print("Conversation")
            print("  how are you\n")

            print("Information")
            print("  your name")
            print("  who created you")
            print("  what is ai")
            print("  date")
            print("  time\n")

            print("Others")
            print("  thanks")
            print("  thank you\n")

            print("Exit")
            print("  bye")
            print("  exit")
            print("  quit")
            print("===================================================\n")

        # Thanks
        elif user_input in thanks_queries:
            print("Bot: You're welcome! I'm happy to help.")

        # Exit
        elif user_input in exit_commands:
            print("Bot: Goodbye! Have a wonderful day.")
            break

        # Unknown input
        else:
            print("Bot: I'm sorry, I didn't understand that.")
            print("Bot: Type 'help' to see the list of available commands.")

        conversation_count += 1


if __name__ == "__main__":
    chatbot()
    