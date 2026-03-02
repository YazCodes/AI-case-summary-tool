# tests to ensure /summarise endpoint behaves predictably 

# Test cases to cover:
# Empty input → returns {"summary": ""} (or a clear error)
# Short input → returns a non-empty string
# Very long input → doesn’t crash (and respects truncation)
# Non-JSON body / wrong schema → returns 422 with helpful message
# Model failure (simulate) → returns 500 with safe error message
# Latency sanity → returns within an acceptable time for small text

import pytest 
from fastapi.testclient import TestClient
from main import app 

clinet = TestClient(app)

# def test_empty_input_returns_empty_summary():
 