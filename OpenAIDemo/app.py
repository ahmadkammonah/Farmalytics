from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key from environment variables
openai.api_key = os.getenv('OPEN_AI_KEY')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get the messages from the client request
        data = request.get_json()
        messages = data.get('message')

        if messages is None:
            return jsonify({'error': 'No messages provided'}), 400

        # Call OpenAI API without streaming
        response = openai.chat.completions.create(
            model="gpt-4",
            messages = [ # Change the prompt parameter to messages parameter
                {"role": "system", "content": "You are a helpful agriculture assistant specialzied in groudn runoff data. I'm currently lcoated in Halifax, NS. Be very consice and reply back with 2 sentences maximum. Always start the conversation with giving me my location."},
                {"role": "user", "content": messages},
            ],
            stream=False
        )


        # Extract the assistant's reply
        assistant_reply = response.choices[0].message.content.strip()

        print(assistant_reply)

        # Return the assistant's reply as JSON
        return jsonify({'response': assistant_reply})

    except Exception as e:
        # Handle and return any errors
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, threaded=True)
