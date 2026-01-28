"""
Pytest configuration for backend testing
"""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Test database setup
TEST_DATABASE_URL = "sqlite:///./test.db"
