"""
BPR Surat - Document Management System for Bank Perkreditan Rakyat

This module provides core functionality for managing letters and documents
in a BPR (Bank Perkreditan Rakyat) environment.
"""

from datetime import datetime
from typing import Optional, List, Dict
from enum import Enum


class SuratType(Enum):
    """Types of letters/documents handled by the system"""
    PEMBERITAHUAN = "pemberitahuan"  # Notification
    PERMOHONAN = "permohonan"  # Application
    KEPUTUSAN = "keputusan"  # Decision
    SURAT_TUGAS = "surat_tugas"  # Assignment Letter
    SURAT_KELUAR = "surat_keluar"  # Outgoing Letter
    SURAT_MASUK = "surat_masuk"  # Incoming Letter


class SuratStatus(Enum):
    """Status of letters in the system"""
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SENT = "sent"
    ARCHIVED = "archived"


class Surat:
    """
    Represents a letter/document in the BPR system
    
    Attributes:
        nomor_surat: Letter reference number
        tanggal: Date of the letter
        jenis: Type of letter
        perihal: Subject matter
        pengirim: Sender
        penerima: Receiver
        isi: Content of the letter
        status: Current status
    """
    
    def __init__(
        self,
        nomor_surat: str,
        tanggal: datetime,
        jenis: SuratType,
        perihal: str,
        pengirim: str,
        penerima: str,
        isi: str,
        status: SuratStatus = SuratStatus.DRAFT
    ):
        self.nomor_surat = nomor_surat
        self.tanggal = tanggal
        self.jenis = jenis
        self.perihal = perihal
        self.pengirim = pengirim
        self.penerima = penerima
        self.isi = isi
        self.status = status
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def update_status(self, new_status: SuratStatus) -> None:
        """Update the status of the letter"""
        self.status = new_status
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict:
        """Convert letter to dictionary representation"""
        return {
            'nomor_surat': self.nomor_surat,
            'tanggal': self.tanggal.isoformat(),
            'jenis': self.jenis.value,
            'perihal': self.perihal,
            'pengirim': self.pengirim,
            'penerima': self.penerima,
            'isi': self.isi,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __str__(self) -> str:
        return f"Surat {self.nomor_surat}: {self.perihal} ({self.status.value})"


class BPRSuratManager:
    """
    Manager class for handling BPR letters/documents
    
    Provides methods to create, update, search and manage letters
    in the BPR document management system.
    """
    
    def __init__(self):
        self.surat_list: List[Surat] = []
    
    def tambah_surat(self, surat: Surat) -> bool:
        """
        Add a new letter to the system
        
        Args:
            surat: Surat object to add
            
        Returns:
            True if successfully added, False otherwise
        """
        # Check for duplicate nomor_surat
        if any(s.nomor_surat == surat.nomor_surat for s in self.surat_list):
            return False
        
        self.surat_list.append(surat)
        return True
    
    def cari_surat(self, nomor_surat: str) -> Optional[Surat]:
        """
        Find a letter by its reference number
        
        Args:
            nomor_surat: Letter reference number
            
        Returns:
            Surat object if found, None otherwise
        """
        for surat in self.surat_list:
            if surat.nomor_surat == nomor_surat:
                return surat
        return None
    
    def update_status_surat(self, nomor_surat: str, new_status: SuratStatus) -> bool:
        """
        Update the status of a letter
        
        Args:
            nomor_surat: Letter reference number
            new_status: New status to set
            
        Returns:
            True if successfully updated, False if letter not found
        """
        surat = self.cari_surat(nomor_surat)
        if surat:
            surat.update_status(new_status)
            return True
        return False
    
    def daftar_surat(self, jenis: Optional[SuratType] = None) -> List[Surat]:
        """
        List all letters, optionally filtered by type
        
        Args:
            jenis: Optional letter type to filter by
            
        Returns:
            List of Surat objects
        """
        if jenis:
            return [s for s in self.surat_list if s.jenis == jenis]
        return self.surat_list.copy()
    
    def hapus_surat(self, nomor_surat: str) -> bool:
        """
        Remove a letter from the system
        
        Args:
            nomor_surat: Letter reference number
            
        Returns:
            True if successfully removed, False if letter not found
        """
        surat = self.cari_surat(nomor_surat)
        if surat:
            self.surat_list.remove(surat)
            return True
        return False
    
    def jumlah_surat(self) -> int:
        """Return the total number of letters in the system"""
        return len(self.surat_list)
