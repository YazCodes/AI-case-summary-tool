from fastapi import FastAPI # web framework 
from fastapi.middleware.cors import CORSMiddleware # allowing the frontend to talk to backend 
from pydantic import BaseModel # formats and validates the JSON 
from transformers import pipeline # for the model 

app = FastAPI() # web app object 

# Allow Next.js (UI) dev server to call this API (backend) without blocking (security reasons)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"], # post, get etc 
    allow_headers=["*"],
)

# Loads my model once outside the function (quicker)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class SummariseRequest(BaseModel):
    case_text: str # what my endpoint expects aka the case text

@app.post("/summarise") # when a post request is sent to /summarise, run the python function
def summarise(req: SummariseRequest):
    text = (req.case_text or "").strip()
    if not text:
        return {"summary": ""} # user clicked summarise with no text

    # BART has input length limits. For MVP, truncate safely.
    # (Later you can do chunking.)
    max_chars = 8000
    if len(text) > max_chars:
        text = text[:max_chars] # if case text is longer, truncate it to the first 8000 characters

    # calling the model 
    result = summarizer(
        text,
        max_length=400,   # summary length (tune later)
        min_length=60,
        do_sample=False  # makes model more deterministic aka more stable output/ no random output aka same input will give same output 
        # Good for Consistency, Reproducibility & Auditability
    )

    return {"summary": result[0]["summary_text"]} # converts the first item in the list into json back to the broswer 



# 1) front end post request { "case_text": "big long judgment text..." }
# 2) API response { "summary": "shorter text..." }