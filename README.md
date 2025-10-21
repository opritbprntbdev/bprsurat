# BPR Surat - Document Management System

BPR Surat is a document management system designed for Bank Perkreditan Rakyat (BPR) to manage letters and official documents efficiently.

## Features

- **Letter Management**: Create, read, update, and delete letters
- **Multiple Letter Types**: Support for various types of letters including:
  - Pemberitahuan (Notification)
  - Permohonan (Application)
  - Keputusan (Decision)
  - Surat Tugas (Assignment Letter)
  - Surat Keluar (Outgoing Letter)
  - Surat Masuk (Incoming Letter)
- **Status Tracking**: Track letter status through workflow (Draft, Pending, Approved, Rejected, Sent, Archived)
- **Search Functionality**: Search letters by reference number
- **Filter by Type**: List letters filtered by type
- **Date Tracking**: Automatic tracking of creation and update timestamps

## Installation

1. Clone the repository:
```bash
git clone https://github.com/opritbprntbdev/bprsurat.git
cd bprsurat
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Example

```python
from datetime import datetime
from bpr_surat import Surat, SuratType, SuratStatus, BPRSuratManager

# Create a manager
manager = BPRSuratManager()

# Create a new letter
surat = Surat(
    nomor_surat="001/BPR/2025",
    tanggal=datetime(2025, 1, 15),
    jenis=SuratType.PEMBERITAHUAN,
    perihal="Pemberitahuan Rapat",
    pengirim="Direktur BPR",
    penerima="Seluruh Karyawan",
    isi="Rapat akan diadakan pada tanggal 20 Januari 2025"
)

# Add to system
manager.tambah_surat(surat)

# Search for a letter
found = manager.cari_surat("001/BPR/2025")

# Update status
manager.update_status_surat("001/BPR/2025", SuratStatus.APPROVED)

# List all letters
all_letters = manager.daftar_surat()

# List by type
notifications = manager.daftar_surat(jenis=SuratType.PEMBERITAHUAN)
```

### Running the Example

Run the example script to see the system in action:

```bash
python example.py
```

## Testing

Run the test suite:

```bash
pytest test_bpr_surat.py -v
```

## API Reference

### Classes

#### `Surat`
Represents a letter/document in the system.

**Attributes:**
- `nomor_surat`: Letter reference number
- `tanggal`: Date of the letter
- `jenis`: Type of letter (SuratType enum)
- `perihal`: Subject matter
- `pengirim`: Sender
- `penerima`: Receiver
- `isi`: Content of the letter
- `status`: Current status (SuratStatus enum)

**Methods:**
- `update_status(new_status)`: Update the status of the letter
- `to_dict()`: Convert letter to dictionary representation

#### `BPRSuratManager`
Manager class for handling BPR letters/documents.

**Methods:**
- `tambah_surat(surat)`: Add a new letter to the system
- `cari_surat(nomor_surat)`: Find a letter by reference number
- `update_status_surat(nomor_surat, new_status)`: Update letter status
- `daftar_surat(jenis=None)`: List all letters, optionally filtered by type
- `hapus_surat(nomor_surat)`: Remove a letter from the system
- `jumlah_surat()`: Get the total number of letters

### Enums

#### `SuratType`
- `PEMBERITAHUAN`: Notification
- `PERMOHONAN`: Application
- `KEPUTUSAN`: Decision
- `SURAT_TUGAS`: Assignment Letter
- `SURAT_KELUAR`: Outgoing Letter
- `SURAT_MASUK`: Incoming Letter

#### `SuratStatus`
- `DRAFT`: Draft
- `PENDING`: Pending review
- `APPROVED`: Approved
- `REJECTED`: Rejected
- `SENT`: Sent
- `ARCHIVED`: Archived

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
