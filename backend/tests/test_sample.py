import pytest

def test_function(x):
     return x + 1
    

# unhappy path 
# def test_answer_one():
#     assert test_function(3) == 5

# happy path 
def test_answer_two():
    assert test_function(1) == 2

def test_answer_three():
     assert test_function(10) == 11