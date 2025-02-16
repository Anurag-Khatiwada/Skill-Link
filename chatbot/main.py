# from flask import Flask, request, Response, jsonify
# from flask_cors import CORS
# from llama_cpp import Llama

# app = Flask(__name__)
# CORS(app)  # Enable CORS to allow requests from React frontend

# # Load the LLaMA model with optimized settings for GPU
# def load_model():
#     global llm
#     try:
#         # Utilize GPU by setting n_gpu_layers to a positive number
#         llm = Llama(model_path="Llama-8B-Distill-CoT.i1-Q4_K_M.gguf", n_ctx=512, n_batch=32, n_gpu_layers=20)
#         print("Model loaded successfully with GPU acceleration.")
#     except Exception as e:
#         print(f"Error loading model: {e}")
#         llm = None

# load_model()

# @app.route('/chat', methods=['POST'])
# def chat():
#     user_input = request.json.get("message", "")
#     if not user_input:
#         return Response("Please enter a message.", mimetype='text/plain')

#     # Add instructions for the model to improve response relevance
#     system_prompt = "You are an intelligent assistant. Provide clear, concise, and accurate answers."
#     full_prompt = f"{system_prompt}\nUser: {user_input}\nAssistant:"

#     def generate_response():
#         try:
#             max_tokens = 512 - len(full_prompt.split())  # Adjust max tokens dynamically
#             for chunk in llm(
#                 full_prompt,
#                 stop=["User:"],  # Adjust stop sequence to avoid premature stops
#                 stream=True,
#                 max_tokens=200,
#                 temperature=0.7,   # Control randomness
#                 top_p=0.9          # Control diversity
#             ):
#                 yield chunk['choices'][0]['text']
#         except Exception as e:
#             yield f"Error generating response: {str(e)}"

#     return Response(generate_response(), mimetype='text/plain')

# @app.route('/health', methods=['GET'])
# def health_check():
#     return jsonify({"status": "OK"}), 200

# if __name__ == "__main__":
#     app.run(debug=True, host="0.0.0.0", port=5000)
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from llama_cpp import Llama

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from React frontend

# Load the LLaMA model with optimized settings for GPU
def load_model():
    global llm
    try:
        # Utilize GPU by setting n_gpu_layers to a positive number
        llm = Llama(model_path="unsloth.Q8_0.gguf", n_ctx=512, n_batch=32, n_gpu_layers=20)
        print("Model loaded successfully with GPU acceleration.")
    except Exception as e:
        print(f"Error loading model: {e}")
        llm = None

load_model()

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message", "").strip()
    if not user_input:
        return Response("Please enter a message.", mimetype='text/plain')

    # Add instructions for the model to improve response relevance
    system_prompt = "You are an intelligent assistant. Provide clear, concise, and accurate answers."
    full_prompt = f"{system_prompt}\nUser: {user_input}\nAssistant:"

    def generate_response():
        try:
            max_tokens = 256 - len(full_prompt.split())  # Adjust max tokens dynamically
            response_text = ""
            for chunk in llm(
                full_prompt,
                stop=["User:", "Assistant:"],  # Define clear stop sequences
                stream=True,
                max_tokens=max_tokens,
                temperature=0.9,   # Control randomness
                top_p=0.9,         # Control diversity
                repeat_penalty=1.2 # Discourage repetition
            ):
                text = chunk['choices'][0]['text']
                response_text += text
                yield text
        except Exception as e:
            yield f"Error generating response: {str(e)}"

    return Response(generate_response(), mimetype='text/plain')

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "OK"}), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
