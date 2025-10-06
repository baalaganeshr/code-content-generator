# Code Content Generator

🚀 **AI-Powered Coding Explanation Platform** with a sleek dark cyberpunk UI, powered by HuggingFace transformer models.

Generate comprehensive explanations for coding problems including:
- Concept breakdowns with analogies
- Naive and optimal solution approaches
- Step-by-step worked examples
- Common pitfalls and fixes
- Edge cases and related problems

## ✨ Features

- **Multi-Stage AI Pipeline**: Three-stage generation (concepts → solutions → pitfalls)
- **Smart Problem Parser**: Extract problems from LeetCode & HackerRank URLs
- **Interactive UI**: Collapsible sections, copy buttons, syntax highlighting
- **Efficient Inference**: 4-bit quantization for GPU optimization
- **Dockerized**: Full-stack deployment with Docker Compose

## 🎯 Requirements

- **Docker** and **Docker Compose**
- **NVIDIA GPU** with at least 8GB VRAM (RTX 3050 or better)
- **NVIDIA Container Toolkit** installed on host
- **24GB+ System RAM** recommended
- **CUDA 11.8+** compatible drivers

## 🚀 Quick Start

### 1. Clone the Repository
```bash
cd code-content-generator
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your HuggingFace token (optional for public models)
```

**Key Environment Variables:**
- `HF_MODEL`: Model name (default: `deepseek-ai/deepseek-coder-6.7b-instruct-awq`)
- `HF_TOKEN`: Your HuggingFace token (get from https://huggingface.co/settings/tokens)
- `DEVICE`: `cuda` for GPU, `cpu` for CPU (slower)
- `QUANTIZATION`: `4bit` recommended for efficiency
- `TEMPERATURE`: 0.7 (adjust 0.1-1.0 for creativity)

### 3. Build and Launch
```bash
docker-compose up --build
```

**First run will:**
- Build backend (Python + FastAPI)
- Build frontend (Nginx)
- Download the AI model (~4-6GB, one-time)
- Start services

### 4. Access the Application

- **Frontend UI**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/api/health

## 📦 Optional: Pre-download Model

Speed up first run by downloading the model beforehand:

**Using Docker:**
```bash
docker-compose exec backend bash /app/scripts/download-model.sh
```

**Or manually:**
```bash
docker-compose exec backend python3 -c "from services.hf_pipeline import get_pipeline; get_pipeline()"
```

## 🎨 Usage

### Via Web UI

1. **Open** http://localhost:3000
2. **Choose input type**:
   - **URL**: Paste LeetCode/HackerRank problem URL
   - **Text**: Paste problem description directly
3. **Click Generate** and wait 30-60 seconds
4. **Explore** generated sections:
   - Problem Overview
   - Concept Breakdown
   - Naive Approach
   - Optimal Approach
   - Worked Example
   - Pitfalls & Related Problems

### Via API

**Generate Explanation:**
```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "input_type": "text",
    "content": "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target."
  }'
```

**Health Check:**
```bash
curl http://localhost:8000/api/health
```

## 🏗️ Project Structure

```
code-content-generator/
├── backend/                 # FastAPI backend
│   ├── api/                # API routes and models
│   │   ├── models.py      # Pydantic schemas
│   │   └── routes.py      # Endpoint handlers
│   ├── config/            # Configuration
│   │   └── settings.py    # Environment settings
│   ├── services/          # Core services
│   │   ├── hf_pipeline.py # HuggingFace model wrapper
│   │   ├── parser.py      # Problem URL parser
│   │   └── prompts.py     # AI prompt templates
│   ├── main.py            # FastAPI app entry
│   └── requirements.txt   # Python dependencies
├── frontend/              # Static frontend
│   ├── css/              # Stylesheets
│   │   ├── styles.css    # Main styles
│   │   └── animations.css # Animations
│   ├── js/               # JavaScript
│   │   ├── app.js        # Main app logic
│   │   ├── renderer.js   # Output rendering
│   │   └── utils.js      # Helper functions
│   └── index.html        # Main HTML
├── scripts/              # Utility scripts
│   └── download-model.sh # Model pre-download
├── docker-compose.yml    # Orchestration
└── README.md             # This file
```

## 🔧 Hardware & Performance

### Model Specifications
- **Default**: `deepseek-ai/deepseek-coder-6.7b-instruct-awq`
- **Size**: ~4GB VRAM (4-bit quantized)
- **Alternative**: `codellama/CodeLlama-7b-Instruct-hf` (8GB VRAM)

### Performance Metrics
- **First Request**: 30-60 seconds (model loading + inference)
- **Subsequent Requests**: 15-30 seconds (inference only)
- **GPU Utilization**: Monitor with `nvidia-smi`

### CPU Fallback
Set `DEVICE=cpu` in `.env` for CPU-only inference:
- ⚠️ **Much slower** (5-10x)
- No GPU required
- Useful for testing/development

## 🐛 Troubleshooting

### CUDA/GPU Issues
```bash
# Verify NVIDIA drivers
nvidia-smi

# Check Docker NVIDIA runtime
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi

# Ensure NVIDIA Container Toolkit installed
# https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html
```

### Out of Memory (OOM)
- **Reduce** `MAX_LENGTH` in `.env` (e.g., 1024)
- **Switch** to CPU: `DEVICE=cpu`
- **Use** smaller model: `HF_MODEL=codellama/CodeLlama-7b-Instruct-hf`
- **Close** other GPU applications

### Slow Generation
- **Check** GPU usage: `nvidia-smi`
- **Verify** 4-bit quantization: `QUANTIZATION=4bit`
- **Warm up** model with test request

### Connection Refused
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart
```

### Model Download Fails
- **Check** internet connection
- **Verify** HuggingFace token (if using gated models)
- **Try** alternative model in `.env`
- **Manual** download via `scripts/download-model.sh`

## 🛠️ Development

### Running Tests
```bash
# Backend tests
docker-compose exec backend pytest

# Lint check
docker-compose exec backend ruff check .
```

### Hot Reload
Frontend automatically reloads (Nginx serves static files).

For backend hot reload:
```bash
# Modify docker-compose.yml to add --reload flag
# Or run locally:
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables
Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

Required variables are documented in `.env.example`.

## 📝 API Documentation

Interactive API docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints

**POST /api/generate**
Generate comprehensive problem explanation.

**Request:**
```json
{
  "input_type": "url|text",
  "content": "problem URL or text"
}
```

**Response:**
```json
{
  "overview": "...",
  "concepts": {...},
  "naive_approach": {...},
  "optimal_approach": {...},
  "worked_example": {...},
  "pitfalls": [...],
  "edge_cases": [...],
  "related_problems": [...]
}
```

**GET /api/health**
Health check endpoint.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **HuggingFace**: For transformer models and libraries
- **DeepSeek**: For the efficient AWQ-quantized coder model
- **FastAPI**: For the excellent web framework
- **Docker**: For containerization platform

## 📧 Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Start a discussion for questions
- **Documentation**: Check `/docs` endpoint for API details

---

**Made with ❤️ for developers who love clean explanations**
- Infrastructure: docker-compose.yml wires GPU-enabled backend and static frontend.
