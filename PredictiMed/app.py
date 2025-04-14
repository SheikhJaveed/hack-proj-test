from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from medical import initialize_models, create_medical_rag_chain, initialize_faiss
# Fix the import path - use a try-except to handle import errors
try:
    from health_democratization_tool.medical_simplifier import MedicalTextSimplifier
    medical_simplifier = MedicalTextSimplifier()
except ImportError as e:
    print(f"Warning: Could not import MedicalTextSimplifier: {e}")
    print("Text simplification feature will be disabled.")
    medical_simplifier = None
except Exception as e:
    print(f"Error initializing MedicalTextSimplifier: {e}")
    print("Text simplification feature will be disabled.")
    medical_simplifier = None

import atexit
import shutil
import os
import logging
import traceback
import re

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Enable CORS for all routes and all origins 
CORS(app, supports_credentials=True)

def cleanup_cache():
    """Delete __pycache__ folder when the application exits"""
    cache_dir = "__pycache__"
    if os.path.exists(cache_dir):
        try:
            shutil.rmtree(cache_dir)
            print("🧹 Cleaned up __pycache__ directory")
        except Exception as e:
            print(f"⚠️ Error cleaning up cache: {str(e)}")

# Register the cleanup function to run on exit
atexit.register(cleanup_cache)

# Initialize the RAG system components
try:
    embeddings, llm = initialize_models()
    vectorstore = initialize_faiss(embeddings)
    chain = create_medical_rag_chain(llm, embeddings, vectorstore)
    print("✅ RAG system initialized successfully")
except Exception as e:
    print(f"❌ Error initializing RAG system: {e}")
    print("Chat functionality will be disabled.")
    chain = None

@app.route('/')
def home():
    return render_template('index.html')

# Add a route to handle OPTIONS preflight requests explicitly
@app.route('/api/healthcare/answer', methods=['OPTIONS'])
def handle_options():
    response = jsonify({'status': 'ok'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    return response

@app.route('/api/healthcare/answer', methods=['POST'])
def health_answer():
    try:
        if chain is None:
            return jsonify({
                'answer': "Error: RAG system is not initialized. Please check server logs.",
                'sources': []
            }), 500

        if not request.is_json:
            return jsonify({
                'answer': "Error: Request must be JSON",
                'sources': []
            }), 400

        data = request.get_json()
        logger.debug('Received data: %s', data)
        
        if 'question' not in data:
            return jsonify({
                'answer': "Error: 'question' field is required",
                'sources': []
            }), 400

        user_message = data['question']
        
        if len(user_message.strip()) < 5:
            return jsonify({
                'answer': "⚠️ Please enter a more detailed question.",
                'sources': []
            })

        # Query the medical RAG system
        response = chain({"query": user_message})
        
        answer = response['result']
        
        # Add a helpful note instead of disclaimer
        answer += "\n\n🏥 How This Information Helps You:\n"
        answer += "• Understand medical conditions better\n"
        answer += "• Learn about symptoms and treatments\n"
        answer += "• Make informed healthcare decisions\n"
        answer += "\nFor personalized medical advice, please consult with healthcare professionals."
        
        return jsonify({
            'answer': answer,
            'sources': []
        })
        
    except Exception as e:
        logger.error('Error: %s', str(e))
        return jsonify({
            'answer': f"❌ Error: {str(e)}. Please try rephrasing your question.",
            'sources': []
        }), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        'status': 'ok',
        'message': 'Server is running correctly'
    })

if __name__ == '__main__':
    print("🏥 Starting Medical Chatbot Server...")
    print("✨ Access the chatbot at http://localhost:5010")
    # Run the server on all interfaces (0.0.0.0) to allow external connections
    app.run(debug=True, host='0.0.0.0', port=5010)