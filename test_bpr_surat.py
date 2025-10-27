"""
Tests for BPR Surat module
"""

import pytest
from datetime import datetime
from bpr_surat import (
    Surat, 
    SuratType, 
    SuratStatus, 
    BPRSuratManager
)


class TestSurat:
    """Test cases for Surat class"""
    
    def test_create_surat(self):
        """Test creating a new Surat object"""
        surat = Surat(
            nomor_surat="001/BPR/2025",
            tanggal=datetime(2025, 1, 15),
            jenis=SuratType.PEMBERITAHUAN,
            perihal="Pemberitahuan Rapat",
            pengirim="Direktur BPR",
            penerima="Seluruh Karyawan",
            isi="Rapat akan diadakan pada tanggal 20 Januari 2025"
        )
        
        assert surat.nomor_surat == "001/BPR/2025"
        assert surat.jenis == SuratType.PEMBERITAHUAN
        assert surat.status == SuratStatus.DRAFT
        assert surat.perihal == "Pemberitahuan Rapat"
    
    def test_update_status(self):
        """Test updating surat status"""
        surat = Surat(
            nomor_surat="002/BPR/2025",
            tanggal=datetime.now(),
            jenis=SuratType.PERMOHONAN,
            perihal="Permohonan Cuti",
            pengirim="Karyawan A",
            penerima="HRD",
            isi="Permohonan cuti selama 5 hari"
        )
        
        initial_updated = surat.updated_at
        surat.update_status(SuratStatus.APPROVED)
        
        assert surat.status == SuratStatus.APPROVED
        assert surat.updated_at > initial_updated
    
    def test_to_dict(self):
        """Test converting surat to dictionary"""
        surat = Surat(
            nomor_surat="003/BPR/2025",
            tanggal=datetime(2025, 1, 15),
            jenis=SuratType.KEPUTUSAN,
            perihal="Keputusan Promosi",
            pengirim="Direktur",
            penerima="Karyawan B",
            isi="Promosi ke posisi supervisor"
        )
        
        surat_dict = surat.to_dict()
        
        assert surat_dict['nomor_surat'] == "003/BPR/2025"
        assert surat_dict['jenis'] == "keputusan"
        assert surat_dict['status'] == "draft"
        assert 'created_at' in surat_dict
        assert 'updated_at' in surat_dict


class TestBPRSuratManager:
    """Test cases for BPRSuratManager class"""
    
    def test_tambah_surat(self):
        """Test adding a new surat"""
        manager = BPRSuratManager()
        surat = Surat(
            nomor_surat="004/BPR/2025",
            tanggal=datetime.now(),
            jenis=SuratType.SURAT_MASUK,
            perihal="Test Surat",
            pengirim="External",
            penerima="BPR",
            isi="Test content"
        )
        
        result = manager.tambah_surat(surat)
        
        assert result is True
        assert manager.jumlah_surat() == 1
    
    def test_tambah_surat_duplicate(self):
        """Test adding duplicate surat (should fail)"""
        manager = BPRSuratManager()
        surat1 = Surat(
            nomor_surat="005/BPR/2025",
            tanggal=datetime.now(),
            jenis=SuratType.SURAT_KELUAR,
            perihal="Test 1",
            pengirim="BPR",
            penerima="Client",
            isi="Content 1"
        )
        surat2 = Surat(
            nomor_surat="005/BPR/2025",  # Same nomor_surat
            tanggal=datetime.now(),
            jenis=SuratType.SURAT_KELUAR,
            perihal="Test 2",
            pengirim="BPR",
            penerima="Client",
            isi="Content 2"
        )
        
        manager.tambah_surat(surat1)
        result = manager.tambah_surat(surat2)
        
        assert result is False
        assert manager.jumlah_surat() == 1
    
    def test_cari_surat(self):
        """Test finding a surat by nomor"""
        manager = BPRSuratManager()
        surat = Surat(
            nomor_surat="006/BPR/2025",
            tanggal=datetime.now(),
            jenis=SuratType.PEMBERITAHUAN,
            perihal="Test Search",
            pengirim="Admin",
            penerima="All",
            isi="Test"
        )
        
        manager.tambah_surat(surat)
        found = manager.cari_surat("006/BPR/2025")
        
        assert found is not None
        assert found.nomor_surat == "006/BPR/2025"
    
    def test_cari_surat_not_found(self):
        """Test searching for non-existent surat"""
        manager = BPRSuratManager()
        found = manager.cari_surat("999/BPR/2025")
        
        assert found is None
    
    def test_update_status_surat(self):
        """Test updating surat status through manager"""
        manager = BPRSuratManager()
        surat = Surat(
            nomor_surat="007/BPR/2025",
            tanggal=datetime.now(),
            jenis=SuratType.PERMOHONAN,
            perihal="Test Status Update",
            pengirim="User",
            penerima="Admin",
            isi="Content"
        )
        
        manager.tambah_surat(surat)
        result = manager.update_status_surat("007/BPR/2025", SuratStatus.PENDING)
        
        assert result is True
        updated_surat = manager.cari_surat("007/BPR/2025")
        assert updated_surat.status == SuratStatus.PENDING
    
    def test_daftar_surat(self):
        """Test listing all surat"""
        manager = BPRSuratManager()
        
        for i in range(3):
            surat = Surat(
                nomor_surat=f"00{i+8}/BPR/2025",
                tanggal=datetime.now(),
                jenis=SuratType.PEMBERITAHUAN,
                perihal=f"Test {i}",
                pengirim="Sender",
                penerima="Receiver",
                isi=f"Content {i}"
            )
            manager.tambah_surat(surat)
        
        all_surat = manager.daftar_surat()
        
        assert len(all_surat) == 3
    
    def test_daftar_surat_by_type(self):
        """Test listing surat filtered by type"""
        manager = BPRSuratManager()
        
        # Add different types of surat
        surat1 = Surat(
            nomor_surat="011/BPR/2025",
            tanggal=datetime.now(),
            jenis=SuratType.PEMBERITAHUAN,
            perihal="Notification",
            pengirim="A",
            penerima="B",
            isi="Content"
        )
        surat2 = Surat(
            nomor_surat="012/BPR/2025",
            tanggal=datetime.now(),
            jenis=SuratType.PERMOHONAN,
            perihal="Application",
            pengirim="C",
            penerima="D",
            isi="Content"
        )
        surat3 = Surat(
            nomor_surat="013/BPR/2025",
            tanggal=datetime.now(),
            jenis=SuratType.PEMBERITAHUAN,
            perihal="Notification 2",
            pengirim="E",
            penerima="F",
            isi="Content"
        )
        
        manager.tambah_surat(surat1)
        manager.tambah_surat(surat2)
        manager.tambah_surat(surat3)
        
        pemberitahuan_list = manager.daftar_surat(jenis=SuratType.PEMBERITAHUAN)
        
        assert len(pemberitahuan_list) == 2
        assert all(s.jenis == SuratType.PEMBERITAHUAN for s in pemberitahuan_list)
    
    def test_hapus_surat(self):
        """Test deleting a surat"""
        manager = BPRSuratManager()
        surat = Surat(
            nomor_surat="014/BPR/2025",
            tanggal=datetime.now(),
            jenis=SuratType.SURAT_TUGAS,
            perihal="Test Delete",
            pengirim="Admin",
            penerima="User",
            isi="Content"
        )
        
        manager.tambah_surat(surat)
        assert manager.jumlah_surat() == 1
        
        result = manager.hapus_surat("014/BPR/2025")
        
        assert result is True
        assert manager.jumlah_surat() == 0
    
    def test_hapus_surat_not_found(self):
        """Test deleting non-existent surat"""
        manager = BPRSuratManager()
        result = manager.hapus_surat("999/BPR/2025")
        
        assert result is False
