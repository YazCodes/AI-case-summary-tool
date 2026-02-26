"use client";  // Server Components or Client Components: run in the browser, can use state, event handlers, fetch from the browser

// Frontend tech stack - TypeScript running inside a Next.js app (A react app)
// page.tsx is a React component written in TypeScript

// next steps can start thinking about basic testing unit tests and ai testing 


import { useState } from "react";

export default function Home() { // home aka page component 

  // these are state variables that update the UI when the variables change
  // memory 
  const [caseText, setCaseText] = useState(""); // setCaseText re-renders the page with the updated value
  const [judgeNotes, setJudgeNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSummarise() { // workflow function - what happens when you click the button 
  setLoading(true); 
  setError(null);
  setSummary(null);

  try {
    const res = await fetch("http://localhost:8000/summarise", { // fetch sends text to python backend 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_text: caseText }), // content type  aka JSON 
    });

    // Handling non-200 responses - res.ok
    if (!res.ok) {
      const text = await res.text(); // show server error detail
      throw new Error(`Backend error ${res.status}: ${text}`);
    }

    const data = await res.json();
    setSummary(data.summary ?? "(No summary returned)"); // ?? initalise object if undefined so if there is no data summary send the error message
  } catch (e: any) {
    setError(e?.message ?? "Request failed");
  } finally {
    setLoading(false);
  }
}

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>AI Case Summary Tool (MVP)</h1>

      <label style={{ display: "block", marginTop: 16, fontWeight: 600 }}>Paste case text</label>
      <textarea
        value={caseText}
        onChange={(e) => setCaseText(e.target.value)}
        placeholder="Paste the key parts of the case here…"
        style={{ width: "100%", minHeight: 140, padding: 10 }}
      />

      <label style={{ display: "block", marginTop: 16, fontWeight: 600 }}>Upload a document (optional)</label>
      <input
        id="fileUpload"
        type="file"
        accept=".pdf,.txt,.docx"
        style={{ display: "none" }} // hiding the old styling 
        onChange={(e) => setFile(e.target.files?.[0] ?? null)} // ? is a null checker (does the object exsit or not) so program does not crash if not
      />

      
        <label // adding styling for the choose file button 
          htmlFor="fileUpload"
          style={{
            display: "inline-block",
            marginTop: 8,
            padding: "5px 7px",
            borderRadius: 3,
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "#f5f5f5"
          }}
        >
          {file ? `Selected: ${file.name}` : "Choose file"} 
          {/* // ternary operator - condition ? (if condition exists) valueIfTrue : valueIfFalse */} 
        </label>

        {file && (
          <p style={{ marginTop: 6 }}>
            You can choose another file if needed.
          </p>
        )}


         {/* this adds the file name at the bottom  */}
        {file && (
          <p style={{ marginTop: 6, fontSize: 14 }}>
            Selected file: {file.name}
          </p>
        )}

      <label style={{ display: "block", marginTop: 16, fontWeight: 600 }}>Judge notes</label>
      <textarea
        value={judgeNotes}
        onChange={(e) => setJudgeNotes(e.target.value)}
        placeholder="This could be a great place to add JT transcribe?"
        style={{ width: "100%", minHeight: 100, padding: 10 }}
      />

      <button
        onClick={onSummarise}
        disabled={loading || (!caseText && !file)} // button is disabled when loading or there is not data input from user
        style={{
          marginTop: 16,
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        {loading ? "Summarising…" : "Summarise"}
      </button>

      {error && (
        <p style={{ marginTop: 12, color: "crimson" }}>
          {error}
        </p>
      )}
          
          {summary && ( // conditional rendering of summary - if summary is not null then show summary box, if null don't show 
            <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
              <h2 style={{ marginTop: 0 }}><strong>Summary:</strong></h2>
              <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>
            </div>
          )}

    </main>
  );
}
