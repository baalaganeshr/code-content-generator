"""
Simple FastAPI Backend for Code Content Generator
Lightweight version - generates structured educational content
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

# Import configuration
try:
    from config import settings
    from hf_pipeline import get_pipeline
    AI_AVAILABLE = True
except Exception as e:
    print(f"AI model not available: {e}")
    AI_AVAILABLE = False
    settings = None

app = FastAPI(title="Code Content Generator API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI pipeline if enabled
ai_pipeline = None
if AI_AVAILABLE and settings and settings.USE_AI_MODEL:
    try:
        print("Initializing AI model...")
        ai_pipeline = get_pipeline()
        print("AI model initialized successfully!")
    except Exception as e:
        print(f"Failed to initialize AI model: {e}")
        ai_pipeline = None

# Models
class GenerateRequest(BaseModel):
    input_type: str
    content: str
    language: str = "python"
    difficulty: str = "medium"

class Approach(BaseModel):
    description: str
    code: str
    time_complexity: str
    space_complexity: str

class Pitfall(BaseModel):
    pitfall: str
    solution: str

class RelatedProblem(BaseModel):
    problem: str
    difficulty: str
    connection: str

class ExplanationOutput(BaseModel):
    overview: str
    concepts: List[str]
    naive_approach: Approach
    optimal_approach: Approach
    worked_example: str
    complexity_analysis: str
    pitfalls: List[Pitfall]
    edge_cases: List[str]
    test_cases: List[str]
    related_problems: List[RelatedProblem]

@app.get("/")
async def root():
    return {"message": "Code Content Generator API", "status": "running"}

@app.get("/api/v1/health")
async def health():
    return {
        "status": "healthy",
        "service": "code-content-generator",
        "version": "2.0",
        "ai_enabled": ai_pipeline is not None,
        "model": settings.HF_MODEL if settings else "None",
        "device": settings.DEVICE if settings else "None"
    }

@app.post("/api/v1/generate", response_model=ExplanationOutput)
async def generate_content(request: GenerateRequest):
    """
    Generate pedagogical explanation for coding problems
    """
    
    # Generate structured response
    problem = request.content.lower()
    lang = request.language
    
    # Detect problem type
    if "two sum" in problem or "add up to" in problem:
        return generate_two_sum_explanation(lang)
    elif "reverse" in problem and ("string" in problem or "array" in problem):
        return generate_reverse_explanation(lang)
    elif "fibonacci" in problem:
        return generate_fibonacci_explanation(lang)
    else:
        return generate_generic_explanation(request.content, lang, request.difficulty)

def generate_two_sum_explanation(lang: str) -> ExplanationOutput:
    """Generate explanation for Two Sum problem"""
    
    naive_code = {
        "python": """def two_sum(nums, target):
    # Check every pair
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []""",
        "javascript": """function twoSum(nums, target) {
    // Check every pair
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}"""
    }
    
    optimal_code = {
        "python": """def two_sum(nums, target):
    # Hash map to store value -> index
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []""",
        "javascript": """function twoSum(nums, target) {
    // Hash map to store value -> index
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}"""
    }
    
    return ExplanationOutput(
        overview="The Two Sum problem asks you to find two numbers in an array that add up to a specific target value. You need to return the indices of these two numbers.",
        
        concepts=[
            "Hash Tables / Hash Maps",
            "Array Traversal",
            "Complement Pattern",
            "Space-Time Tradeoff"
        ],
        
        naive_approach=Approach(
            description="The brute force approach checks every possible pair of numbers using nested loops. For each number, we check if it can be paired with any subsequent number to reach the target.",
            code=naive_code.get(lang, naive_code["python"]),
            time_complexity="O(n²)",
            space_complexity="O(1)"
        ),
        
        optimal_approach=Approach(
            description="Use a hash map to store numbers we've seen. For each number, calculate its complement (target - number) and check if we've seen it before. This reduces lookup time from O(n) to O(1).",
            code=optimal_code.get(lang, optimal_code["python"]),
            time_complexity="O(n)",
            space_complexity="O(n)"
        ),
        
        worked_example="""Example: nums = [2, 7, 11, 15], target = 9

Step 1: i=0, num=2
  - complement = 9 - 2 = 7
  - 7 not in seen
  - seen = {2: 0}

Step 2: i=1, num=7
  - complement = 9 - 7 = 2
  - 2 IS in seen at index 0
  - return [0, 1] ✓""",
        
        complexity_analysis="""
Time Complexity: O(n)
- We traverse the array once
- Hash map lookup/insert is O(1) on average

Space Complexity: O(n)
- Worst case: store all n numbers in hash map
- Trade space for time efficiency""",
        
        pitfalls=[
            Pitfall(
                pitfall="Using the same element twice",
                solution="Always check j > i in nested loop approach, or check index in hash map approach"
            ),
            Pitfall(
                pitfall="Not handling the case when no solution exists",
                solution="Return empty array or raise an exception as specified"
            ),
            Pitfall(
                pitfall="Assuming sorted array",
                solution="Don't sort! This changes indices. Use hash map instead"
            )
        ],
        
        edge_cases=[
            "Empty array: []",
            "Array with 1 element: [5]",
            "Negative numbers: [-1, -2, -3, -4]",
            "Duplicate values: [3, 3], target = 6",
            "Target not achievable: [1, 2, 3], target = 10"
        ],
        
        test_cases=[
            "assert two_sum([2,7,11,15], 9) == [0,1]",
            "assert two_sum([3,2,4], 6) == [1,2]",
            "assert two_sum([3,3], 6) == [0,1]",
            "assert two_sum([1,2,3], 10) == []"
        ],
        
        related_problems=[
            RelatedProblem(
                problem="Three Sum",
                difficulty="medium",
                connection="Extends two sum to find three numbers that sum to target"
            ),
            RelatedProblem(
                problem="Two Sum II - Sorted Array",
                difficulty="medium",
                connection="Same problem but array is sorted, can use two pointers"
            ),
            RelatedProblem(
                problem="4Sum",
                difficulty="medium",
                connection="Find four numbers that sum to target"
            )
        ]
    )

def generate_generic_explanation(content: str, lang: str, difficulty: str) -> ExplanationOutput:
    """Generate generic explanation for any problem"""
    
    return ExplanationOutput(
        overview=f"This problem involves: {content[:200]}...",
        
        concepts=[
            "Problem Analysis",
            "Algorithm Design",
            "Code Implementation",
            "Testing & Validation"
        ],
        
        naive_approach=Approach(
            description="A straightforward brute force approach that checks all possibilities systematically.",
            code=f"# {lang.capitalize()} brute force solution\n# Iterate through all possibilities\nfor item in collection:\n    # Check condition\n    if meets_criteria(item):\n        return result",
            time_complexity="O(n²) or higher",
            space_complexity="O(1) or O(n)"
        ),
        
        optimal_approach=Approach(
            description="An optimized solution using efficient data structures and algorithms to reduce time complexity.",
            code=f"# {lang.capitalize()} optimized solution\n# Use hash map / dynamic programming\nfor item in collection:\n    # Process efficiently\n    result = optimize(item)\nreturn result",
            time_complexity="O(n) or O(n log n)",
            space_complexity="O(n)"
        ),
        
        worked_example=f"""Example walkthrough:
Input: sample_input
Step 1: Initialize data structures
Step 2: Process elements
Step 3: Return result
Output: expected_output""",
        
        complexity_analysis="""
Time Complexity Analysis:
- Brute force: Higher polynomial time
- Optimized: Linear or linearithmic time

Space Complexity Analysis:
- Consider auxiliary data structures
- Trade-off between time and space""",
        
        pitfalls=[
            Pitfall(
                pitfall="Off-by-one errors in loops",
                solution="Carefully check loop boundaries and array indices"
            ),
            Pitfall(
                pitfall="Not handling edge cases",
                solution="Test with empty inputs, single elements, and boundary values"
            )
        ],
        
        edge_cases=[
            "Empty input",
            "Single element",
            "Duplicate values",
            "Maximum/minimum values"
        ],
        
        test_cases=[
            "# Test case 1: Normal case",
            "# Test case 2: Edge case",
            "# Test case 3: Boundary condition"
        ],
        
        related_problems=[
            RelatedProblem(
                problem="Similar Problem 1",
                difficulty=difficulty,
                connection="Uses same algorithm pattern"
            ),
            RelatedProblem(
                problem="Similar Problem 2",
                difficulty=difficulty,
                connection="Applies same data structure"
            )
        ]
    )

def generate_reverse_explanation(lang: str) -> ExplanationOutput:
    """Generate explanation for string/array reversal"""
    
    code_samples = {
        "python": {
            "naive": "def reverse(s):\n    return s[::-1]  # Built-in slicing",
            "optimal": "def reverse(s):\n    left, right = 0, len(s) - 1\n    s = list(s)\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1\n    return ''.join(s)"
        },
        "javascript": {
            "naive": "function reverse(s) {\n    return s.split('').reverse().join('');\n}",
            "optimal": "function reverse(s) {\n    const arr = s.split('');\n    let left = 0, right = arr.length - 1;\n    while (left < right) {\n        [arr[left], arr[right]] = [arr[right], arr[left]];\n        left++;\n        right--;\n    }\n    return arr.join('');\n}"
        }
    }
    
    codes = code_samples.get(lang, code_samples["python"])
    
    return ExplanationOutput(
        overview="String/Array reversal requires reversing the order of elements. Can be done in-place or using additional space.",
        concepts=["Two Pointers", "In-place Modification", "String Manipulation"],
        naive_approach=Approach(
            description="Use built-in reverse functions or create new reversed structure",
            code=codes["naive"],
            time_complexity="O(n)",
            space_complexity="O(n)"
        ),
        optimal_approach=Approach(
            description="Two-pointer technique: swap elements from both ends moving towards center",
            code=codes["optimal"],
            time_complexity="O(n)",
            space_complexity="O(1)"
        ),
        worked_example="Input: 'hello'\nStep 1: swap h and o -> 'oellh'\nStep 2: swap e and l -> 'olleh'\nOutput: 'olleh'",
        complexity_analysis="Time: O(n) - visit each element once\nSpace: O(1) - in-place modification",
        pitfalls=[
            Pitfall("String immutability", "Convert to array/list first in immutable languages"),
            Pitfall("Not updating both pointers", "Increment left AND decrement right in each iteration")
        ],
        edge_cases=["Empty string", "Single character", "Palindrome"],
        test_cases=["reverse('hello') == 'olleh'", "reverse('') == ''", "reverse('a') == 'a'"],
        related_problems=[
            RelatedProblem("Reverse Words in String", "medium", "Similar reversal logic"),
            RelatedProblem("Palindrome Check", "easy", "Uses two-pointer pattern")
        ]
    )

def generate_fibonacci_explanation(lang: str) -> ExplanationOutput:
    """Generate explanation for Fibonacci"""
    
    return ExplanationOutput(
        overview="Calculate the nth Fibonacci number where F(n) = F(n-1) + F(n-2), with F(0)=0, F(1)=1",
        concepts=["Recursion", "Dynamic Programming", "Memoization", "Iteration"],
        naive_approach=Approach(
            description="Recursive solution - elegant but inefficient due to repeated calculations",
            code="def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)",
            time_complexity="O(2ⁿ)",
            space_complexity="O(n)"
        ),
        optimal_approach=Approach(
            description="Iterative with two variables - constant space, linear time",
            code="def fib(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n+1):\n        a, b = b, a + b\n    return b",
            time_complexity="O(n)",
            space_complexity="O(1)"
        ),
        worked_example="F(5):\nF(0)=0, F(1)=1\nF(2)=0+1=1\nF(3)=1+1=2\nF(4)=1+2=3\nF(5)=2+3=5",
        complexity_analysis="Recursive: O(2ⁿ) - exponential tree\nDP/Iterative: O(n) - single pass",
        pitfalls=[
            Pitfall("Stack overflow with recursion", "Use iteration or memoization"),
            Pitfall("Integer overflow for large n", "Use appropriate data types")
        ],
        edge_cases=["n = 0", "n = 1", "Large n (>50)"],
        test_cases=["fib(0) == 0", "fib(1) == 1", "fib(5) == 5", "fib(10) == 55"],
        related_problems=[
            RelatedProblem("Climbing Stairs", "easy", "Same recurrence relation"),
            RelatedProblem("House Robber", "medium", "Dynamic programming pattern")
        ]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
