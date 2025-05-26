import sys, json, pickle, os
import numpy as np

# Load the trained model

def load_model():
    model_path = os.path.join(os.path.dirname(__file__), '../machine-learning/model_rf.pkl')
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    return model

if __name__ == '__main__':
    # Expecting input JSON as first argument
    try:
        input_json = sys.argv[1]
        data = json.loads(input_json)
    except Exception as e:
        print(json.dumps({'error': f'Invalid input: {e}'}))
        sys.exit(1)

    # Convert dict or list to numpy array
    if isinstance(data, dict):
        features = list(data.values())
    else:
        features = data
    X = np.array([features])

    model = load_model()
    try:
        pred = model.predict(X)[0]
        proba = model.predict_proba(X)[0].tolist()
    except Exception:
        pred = model.predict(X)[0]
        proba = []

    result = {'prediction': int(pred), 'probabilities': proba}
    print(json.dumps(result)) 