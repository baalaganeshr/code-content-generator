# 🧪 Testing Guide - Code Content Generator

## ✅ Current Status

**Containers Running:**
- ✅ Frontend: http://localhost:3002 (code-gen-frontend)
- ✅ Backend: http://localhost:8001 (code-gen-backend)
- ✅ Model: Qwen/Qwen2.5-Coder-1.5B-Instruct
- ✅ Health: http://localhost:8001/api/health

---

## 🧪 Test 1: Health Check

**Verify backend is responding:**

```powershell
Invoke-WebRequest -Uri "http://localhost:8001/api/health"
```

**Expected Output:**
```json
{"status":"healthy","model":"deepseek-coder-6.7b-awq"}
```

---

## 🧪 Test 2: Direct Text Input

**Steps:**
1. Open: http://localhost:3002
2. Click **"Paste Text"** tab
3. Paste this problem:

```
Given an array of integers nums and an integer target, return indices 
of the two numbers such that they add up to target.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

4. Click **"Generate Explanation"**
5. Watch for:
   - ✅ Loading spinner appears
   - ✅ Progress steps animate (Extracting concepts... → Generating solutions... → Identifying pitfalls...)
   - ✅ Results display after ~60-90 seconds

**Expected Output Sections:**
- 📊 Overview
- 🧠 Key Concepts
- 🔄 Naive Approach
- ⚡ Optimal Approach
- 📝 Worked Example
- ⚠️ Common Pitfalls
- 🎯 Edge Cases
- 🔗 Related Problems

---

## 🧪 Test 3: URL Input

**Steps:**
1. Click **"URL"** tab
2. Enter: `https://leetcode.com/problems/two-sum/`
3. Click **"Generate Explanation"**
4. Wait for results (~60-90 seconds)

**What Happens:**
- Backend fetches the problem from LeetCode
- Parses the HTML to extract problem text
- Generates pedagogical explanation

---

## 🧪 Test 4: Browser Console Check

**Open Developer Tools (F12) and check for:**

✅ **No Errors** in Console tab
✅ **Network tab** shows:
   - `POST /api/generate` with Status 200
   - Response contains JSON with all sections

❌ **Common Issues:**
- CORS errors → Backend CORS already configured
- 500 errors → Check backend logs: `docker logs code-gen-backend`
- Timeout → Model still downloading (check logs)

---

## 🧪 Test 5: Different Problem Types

Try these to verify versatility:

### **Easy Problem:**
```
https://leetcode.com/problems/valid-parentheses/
```

### **Medium Problem:**
```
https://leetcode.com/problems/longest-substring-without-repeating-characters/
```

### **Custom Text:**
```
Write a function to reverse a linked list in-place.

Input: 1 -> 2 -> 3 -> 4 -> 5
Output: 5 -> 4 -> 3 -> 2 -> 1
```

---

## 🐛 Debugging Commands

### **Check Container Status:**
```powershell
docker ps --filter "name=code-gen"
```

### **View Backend Logs:**
```powershell
docker logs code-gen-backend --tail 50
```

### **View Frontend Logs:**
```powershell
docker logs code-gen-frontend --tail 20
```

### **Test API Directly:**
```powershell
$body = '{"input_type":"text","content":"Given an array, find two numbers that add up to a target."}' 
Invoke-WebRequest -Uri "http://localhost:3002/api/generate" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 180
```

### **Restart Containers:**
```powershell
docker-compose restart
```

---

## 📊 Expected Response Format

```json
{
  "overview": "Problem description (first 500 chars)...",
  "concepts": {
    "concepts": ["Hash Tables", "Array Traversal"],
    "prerequisites": ["Arrays", "Basic Math"],
    "difficulty": "Medium",
    "difficulty_reason": "Requires understanding of hash tables...",
    "analogy": "Like finding matching puzzle pieces..."
  },
  "naive_approach": {
    "name": "Brute Force",
    "intuition": "Check every pair...",
    "pseudocode": "for i... for j...",
    "time_complexity": "O(n²)",
    "space_complexity": "O(1)",
    "limitation": "Too slow for large inputs"
  },
  "optimal_approach": {
    "name": "Hash Map",
    "key_insight": "Store complements...",
    "pseudocode": "seen = {}...",
    "time_complexity": "O(n)",
    "space_complexity": "O(n)",
    "why_optimal": "Single pass with constant lookups"
  },
  "worked_example": {
    "input": "nums = [2,7,11,15], target = 9",
    "steps": ["i=0, num=2...", "i=1, num=7..."],
    "output": "[0, 1]"
  },
  "pitfalls": [
    {"mistake": "...", "why_fails": "...", "fix": "..."}
  ],
  "edge_cases": ["Empty array", "No solution", "Duplicates"],
  "related_problems": [
    {"name": "3Sum", "platform": "LeetCode", "difficulty": "Medium"}
  ]
}
```

---

## ✨ Next Steps

Once basic testing works:

1. **Test Creative Features:**
   - Mermaid diagrams
   - Code skeleton generator
   - Export to PDF/Markdown

2. **Performance Testing:**
   - Try 5+ problems in a row
   - Check memory usage
   - Verify model caching works

3. **Add PDF Support:**
   - Install PyPDF2
   - Enable PDF upload tab
   - Test with PDF problem statements

---

**Happy Testing! 🚀**

For issues, check:
1. Docker logs
2. Browser console (F12)
3. Backend health endpoint
