#!/bin/bash
# Download and cache HuggingFace model for the Code Content Generator
# This script pre-downloads the model to avoid delays during first run

set -e

MODEL_NAME="${HF_MODEL:-deepseek-ai/deepseek-coder-6.7b-instruct-awq}"

echo "========================================="
echo "HuggingFace Model Download Script"
echo "========================================="
echo "Model: $MODEL_NAME"
echo "This may take several minutes..."
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is required but not found"
    exit 1
fi

# Check if required packages are installed
python3 -c "import transformers" 2>/dev/null || {
    echo "Error: transformers package not found"
    echo "Please install: pip install transformers"
    exit 1
}

# Download the model using Python
python3 << EOF
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

model_name = os.getenv('HF_MODEL', 'deepseek-ai/deepseek-coder-6.7b-instruct-awq')
hf_token = os.getenv('HF_TOKEN', None)

print(f"Downloading tokenizer for {model_name}...")
kwargs = {'trust_remote_code': True}
if hf_token:
    kwargs['token'] = hf_token

tokenizer = AutoTokenizer.from_pretrained(model_name, **kwargs)
print("✓ Tokenizer downloaded successfully")

print(f"\nDownloading model {model_name}...")
print("Note: This is a large download and may take 10-30 minutes depending on your connection")

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    **kwargs
)
print("✓ Model downloaded successfully")
print("\n✓ All downloads complete! Model is cached and ready to use.")
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✓ SUCCESS: Model download complete"
    echo "========================================="
else
    echo ""
    echo "========================================="
    echo "✗ ERROR: Model download failed"
    echo "========================================="
    exit 1
fi
