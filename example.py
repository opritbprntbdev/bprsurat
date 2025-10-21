"""
Example usage of BPR Surat module

This script demonstrates how to use the BPR Surat document management system.
"""

from datetime import datetime
from bpr_surat import (
    Surat,
    SuratType,
    SuratStatus,
    BPRSuratManager
)


def main():
    print("=== BPR Surat - Document Management System ===\n")
    
    # Create manager instance
    manager = BPRSuratManager()
    
    # Create some sample letters
    print("1. Creating sample letters...")
    
    surat1 = Surat(
        nomor_surat="001/BPR/2025",
        tanggal=datetime(2025, 1, 15),
        jenis=SuratType.PEMBERITAHUAN,
        perihal="Pemberitahuan Rapat Tahunan",
        pengirim="Direktur BPR",
        penerima="Seluruh Karyawan",
        isi="Dengan hormat, kami mengundang seluruh karyawan untuk menghadiri rapat tahunan."
    )
    
    surat2 = Surat(
        nomor_surat="002/BPR/2025",
        tanggal=datetime(2025, 1, 16),
        jenis=SuratType.PERMOHONAN,
        perihal="Permohonan Cuti Tahunan",
        pengirim="Ahmad Suryadi",
        penerima="Bagian HRD",
        isi="Saya mengajukan permohonan cuti tahunan selama 5 hari kerja."
    )
    
    surat3 = Surat(
        nomor_surat="003/BPR/2025",
        tanggal=datetime(2025, 1, 17),
        jenis=SuratType.KEPUTUSAN,
        perihal="Keputusan Promosi Karyawan",
        pengirim="Direktur BPR",
        penerima="Siti Aminah",
        isi="Berdasarkan kinerja yang baik, kami memutuskan untuk mempromosikan ke posisi supervisor."
    )
    
    # Add letters to the system
    manager.tambah_surat(surat1)
    manager.tambah_surat(surat2)
    manager.tambah_surat(surat3)
    
    print(f"   Added {manager.jumlah_surat()} letters to the system\n")
    
    # List all letters
    print("2. Listing all letters:")
    for surat in manager.daftar_surat():
        print(f"   - {surat}")
    print()
    
    # Search for a specific letter
    print("3. Searching for letter 002/BPR/2025:")
    found = manager.cari_surat("002/BPR/2025")
    if found:
        print(f"   Found: {found}")
        print(f"   Subject: {found.perihal}")
        print(f"   Status: {found.status.value}\n")
    
    # Update status
    print("4. Updating status of letter 002/BPR/2025 to APPROVED:")
    manager.update_status_surat("002/BPR/2025", SuratStatus.APPROVED)
    updated = manager.cari_surat("002/BPR/2025")
    print(f"   New status: {updated.status.value}\n")
    
    # List by type
    print("5. Listing all PEMBERITAHUAN letters:")
    pemberitahuan = manager.daftar_surat(jenis=SuratType.PEMBERITAHUAN)
    for surat in pemberitahuan:
        print(f"   - {surat}")
    print()
    
    # Convert to dictionary
    print("6. Converting letter to dictionary format:")
    surat_dict = surat1.to_dict()
    print(f"   Nomor: {surat_dict['nomor_surat']}")
    print(f"   Type: {surat_dict['jenis']}")
    print(f"   Subject: {surat_dict['perihal']}")
    print(f"   Status: {surat_dict['status']}\n")
    
    print("=== Demo completed successfully ===")


if __name__ == "__main__":
    main()
