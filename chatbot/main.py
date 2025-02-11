from flask import Flask, request, Response
from flask_cors import CORS
from llama_cpp import Llama

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from React frontend

# Load the LLaMA model with optimized settings
def load_model():
    global llm
    llm = Llama(model_path="unsloth.Q8_0.gguf", n_ctx=256, n_batch=32, n_gpu_layers=1)

load_model()

chat_history = []

@app.route('/chat', methods=['POST'])
def chat():
    global chat_history
    user_input = request.json.get("message", "").strip()
    if not user_input:
        return Response("Please enter a message.", mimetype='text/plain')

    chat_history.append({"role": "user", "content": user_input})

    conversation_history = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in chat_history[-5:]])
    full_prompt = f"{conversation_history}\nAssistant (Respond in same language as query):"

    def generate_response():
        try:
            for chunk in llm(full_prompt, stop=["User:", "Assistant:"], stream=True, max_tokens=500):
                yield chunk['choices'][0]['text']
        except Exception as e:
            yield "Error generating response. Please try again."

    return Response(generate_response(), mimetype='text/plain')

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
