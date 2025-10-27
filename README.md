# bprsurat
BPR Surat - Letter and Document Management System

## Features

### Mang Agus Module
A simple module for handling BPR letters and documents operations.

#### Usage

```python
from mang_agus import MangAgus

# Create a handler
handler = MangAgus()

# Add a letter
letter = {
    'id': 1,
    'title': 'Sample Letter',
    'content': 'Letter content here',
    'date': '2025-10-21'
}
handler.add_letter(letter)

# Retrieve a letter
retrieved = handler.get_letter(1)

# List all letters
all_letters = handler.list_letters()

# Get handler info
info = handler.get_info()
```

#### Running the Example

```bash
python3 mang_agus.py
```

#### Running Tests

```bash
python3 -m unittest test_mang_agus -v
```
