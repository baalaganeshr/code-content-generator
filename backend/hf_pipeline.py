"""HuggingFace Pipeline for AI model integration"""
from __future__ import annotations

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from config import settings

class HFPipeline:
    def __init__(self) -> None:
        self.device = settings.DEVICE
        self.model_name = settings.HF_MODEL

        quantization_config = BitsAndBytesConfig(
            load_in_4bit=settings.QUANTIZATION == "4bit",
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
        )

        hf_kwargs = {"trust_remote_code": True}
        if settings.HF_TOKEN:
            hf_kwargs["token"] = settings.HF_TOKEN

        print(f"Loading model: {self.model_name} on {self.device}")
        
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, **hf_kwargs)

        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            device_map="auto" if settings.DEVICE != "cpu" else None,
            quantization_config=quantization_config if settings.DEVICE != "cpu" else None,
            **hf_kwargs,
        )
        
        print(f"Model loaded successfully on {self.device}")

    def generate(self, prompt: str, max_new_tokens: int = 1024) -> str:
        limit = min(max_new_tokens, settings.MAX_LENGTH)
        inputs = self.tokenizer(prompt, return_tensors="pt")
        device = getattr(self.model, "device", None)
        if device is None:
            device = next(self.model.parameters()).device
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=limit,
                temperature=settings.TEMPERATURE,
                do_sample=True,
                top_p=0.95,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        decoded = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        if decoded.startswith(prompt):
            decoded = decoded[len(prompt) :]
        return decoded.strip()


_hf_pipeline: HFPipeline | None = None


def get_pipeline() -> HFPipeline:
    global _hf_pipeline
    if _hf_pipeline is None:
        _hf_pipeline = HFPipeline()
    return _hf_pipeline
