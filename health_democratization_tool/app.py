from flask import Flask, render_template, request, jsonify
from medical_simplifier import MedicalTextSimplifier
import re

app = Flask(__name__)
simplifier = MedicalTextSimplifier()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/simplify', methods=['POST'])
def simplify():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'error': 'Please enter some text'}), 400
            
        # Get medical terms and their explanations
        medical_terms = simplifier.identify_medical_terms(text)
        simplified_text = text
        
        explanations = []
        for term_info in medical_terms:
            term = term_info['term']
            simplified_def = simplifier.generate_simplified_explanation(term, text)
            explanations.append({
                'term': term,
                'explanation': simplified_def
            })
            pattern = r'\b' + re.escape(term) + r'\b'
            simplified_text = re.sub(pattern, f"{term} ({simplified_def})", simplified_text)
            
        return jsonify({
            'original_text': text,
            'simplified_text': simplified_text,
            'explanations': explanations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5008) 