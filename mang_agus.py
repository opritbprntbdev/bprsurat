"""
Mang Agus Module
A simple module for handling BPR Surat (letters/documents) operations.
"""

class MangAgus:
    """
    MangAgus class for managing BPR letters and documents.
    """
    
    def __init__(self, name="Mang Agus"):
        """
        Initialize MangAgus with a name.
        
        Args:
            name (str): The name of the handler. Default is "Mang Agus"
        """
        self.name = name
        self.letters = []
    
    def add_letter(self, letter_data):
        """
        Add a new letter to the collection.
        
        Args:
            letter_data (dict): Dictionary containing letter information
                Expected keys: 'id', 'title', 'content', 'date'
        
        Returns:
            bool: True if letter was added successfully, False otherwise
        """
        if not isinstance(letter_data, dict):
            return False
        
        required_keys = ['id', 'title', 'content']
        if not all(key in letter_data for key in required_keys):
            return False
        
        self.letters.append(letter_data)
        return True
    
    def get_letter(self, letter_id):
        """
        Retrieve a letter by its ID.
        
        Args:
            letter_id: The ID of the letter to retrieve
        
        Returns:
            dict or None: The letter data if found, None otherwise
        """
        for letter in self.letters:
            if letter.get('id') == letter_id:
                return letter
        return None
    
    def list_letters(self):
        """
        Get a list of all letters.
        
        Returns:
            list: List of all letters
        """
        return self.letters.copy()
    
    def get_info(self):
        """
        Get information about the handler.
        
        Returns:
            str: Information about the handler and letter count
        """
        return f"{self.name} - Managing {len(self.letters)} letter(s)"


def main():
    """
    Main function to demonstrate MangAgus functionality.
    """
    handler = MangAgus()
    print(handler.get_info())
    
    # Example letter
    sample_letter = {
        'id': 1,
        'title': 'Sample BPR Letter',
        'content': 'This is a sample letter managed by Mang Agus',
        'date': '2025-10-21'
    }
    
    if handler.add_letter(sample_letter):
        print(f"Letter added successfully: {sample_letter['title']}")
    
    print(handler.get_info())
    
    retrieved = handler.get_letter(1)
    if retrieved:
        print(f"Retrieved letter: {retrieved['title']}")


if __name__ == "__main__":
    main()
