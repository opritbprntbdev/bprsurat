"""
Unit tests for the Mang Agus module.
"""

import unittest
from mang_agus import MangAgus


class TestMangAgus(unittest.TestCase):
    """Test cases for MangAgus class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.handler = MangAgus()
        self.sample_letter = {
            'id': 1,
            'title': 'Test Letter',
            'content': 'Test content',
            'date': '2025-10-21'
        }
    
    def test_initialization(self):
        """Test MangAgus initialization."""
        self.assertEqual(self.handler.name, "Mang Agus")
        self.assertEqual(len(self.handler.letters), 0)
    
    def test_initialization_with_custom_name(self):
        """Test MangAgus initialization with custom name."""
        custom_handler = MangAgus(name="Custom Handler")
        self.assertEqual(custom_handler.name, "Custom Handler")
    
    def test_add_letter_success(self):
        """Test adding a valid letter."""
        result = self.handler.add_letter(self.sample_letter)
        self.assertTrue(result)
        self.assertEqual(len(self.handler.letters), 1)
    
    def test_add_letter_invalid_type(self):
        """Test adding invalid letter type."""
        result = self.handler.add_letter("invalid")
        self.assertFalse(result)
        self.assertEqual(len(self.handler.letters), 0)
    
    def test_add_letter_missing_keys(self):
        """Test adding letter with missing required keys."""
        invalid_letter = {'id': 1, 'title': 'Missing content'}
        result = self.handler.add_letter(invalid_letter)
        self.assertFalse(result)
        self.assertEqual(len(self.handler.letters), 0)
    
    def test_get_letter_exists(self):
        """Test retrieving an existing letter."""
        self.handler.add_letter(self.sample_letter)
        retrieved = self.handler.get_letter(1)
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved['title'], 'Test Letter')
    
    def test_get_letter_not_exists(self):
        """Test retrieving a non-existent letter."""
        retrieved = self.handler.get_letter(999)
        self.assertIsNone(retrieved)
    
    def test_list_letters(self):
        """Test listing all letters."""
        self.handler.add_letter(self.sample_letter)
        second_letter = {
            'id': 2,
            'title': 'Second Letter',
            'content': 'Second content',
            'date': '2025-10-22'
        }
        self.handler.add_letter(second_letter)
        
        letters = self.handler.list_letters()
        self.assertEqual(len(letters), 2)
        self.assertEqual(letters[0]['id'], 1)
        self.assertEqual(letters[1]['id'], 2)
    
    def test_get_info(self):
        """Test getting handler information."""
        info = self.handler.get_info()
        self.assertIn("Mang Agus", info)
        self.assertIn("0 letter(s)", info)
        
        self.handler.add_letter(self.sample_letter)
        info = self.handler.get_info()
        self.assertIn("1 letter(s)", info)


if __name__ == '__main__':
    unittest.main()
