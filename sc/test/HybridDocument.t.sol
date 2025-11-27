// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {IssuerRegistry} from "../src/IssuerRegistry.sol";
import {HybridDocument} from "../src/HybridDocument.sol";

contract HybridDocumentTest is Test {
    IssuerRegistry public registry;
    HybridDocument public document;

    // --- DEFINISI AKTOR (Platform General) ---
    address public platformAdmin = address(1); // Kamu (Pemilik Platform)
    address public mitraResmi = address(2);    // Institusi Partner (PT A, Org B, Dinas C)
    address public joko = address(3);          // User Umum (Masyarakat)
    address public penipu = address(4);        // Pihak Jahat

    function setUp() public {
        // 1. Admin deploy sistem
        vm.startPrank(platformAdmin);
        registry = new IssuerRegistry();
        document = new HybridDocument(address(registry));

        // 2. Mendaftarkan MITRA KERJASAMA (Partnership)
        // Contoh: "Badan Sertifikasi Nasional" atau "PT. Mencari Cinta Sejati"
        registry.addIssuer(mitraResmi, "Mitra Terverifikasi A");

        vm.stopPrank();
    }

    // ==========================================
    // SKENARIO 1: MITRA/INSTITUSI (PARTNERSHIP)
    // ==========================================

    function testMitraMinting_Verified() public {
        // Simulasi: Mitra menerbitkan sertifikat resmi ke User
        vm.startPrank(mitraResmi);

        // Cetak Dokumen Resmi (SBT = true)
        // Contoh: Sertifikat Kompetensi Kerja, SK Karyawan
        document.mintOfficialDocument(joko, "ipfs://metadata-sertifikat-resmi", true);

        // Validasi:
        assertEq(document.ownerOf(0), joko);           // Pemilik: Joko
        assertEq(document.isSoulbound(0), true);       // Tipe: SBT (Terkunci)
        assertEq(document.isVerifiedIssuer(0), true);  // Status: VERIFIED (Centang Biru)
        
        vm.stopPrank();
    }

    // ==========================================
    // SKENARIO 2: PUBLIC USER (JOKO)
    // ==========================================

    function testPublicMinting_Mandiri() public {
        // Simulasi: Joko upload dokumen sendiri tanpa lewat mitra
        vm.startPrank(joko);

        // Upload Surat Warisan / Perjanjian (SBT = true)
        document.mintPublicDocument("ipfs://surat-warisan-joko", true);

        // Validasi:
        assertEq(document.ownerOf(0), joko);           // Pemilik: Joko
        assertEq(document.isSoulbound(0), true);       // Tipe: SBT (Terkunci Aman)
        assertEq(document.isVerifiedIssuer(0), false); // Status: UNVERIFIED (Self-Signed)

        vm.stopPrank();
    }

    // ==========================================
    // SKENARIO 3: KEAMANAN (TRANSFER & JUAL BELI)
    // ==========================================

    function testSBT_TidakBisaDijual() public {
        // 1. Joko sudah punya dokumen (misal Surat Warisan)
        vm.startPrank(joko);
        document.mintPublicDocument("ipfs://surat-warisan", true);

        // 2. Joko (atau hacker yg hack akun Joko) coba transfer ke Penipu
        // EKSPEKTASI: GAGAL (Revert)
        vm.expectRevert("Error: Dokumen ini bersifat Soulbound dan tidak bisa dipindahtangankan!");
        document.transferFrom(joko, penipu, 0);

        vm.stopPrank();
    }

    function testNFT_BisaDijual() public {
        // 1. Joko bikin Karya Seni / Tiket (NFT Biasa)
        // Parameter 'false' artinya BISA dipindah
        vm.startPrank(joko);
        document.mintPublicDocument("ipfs://gambar-karya-seni", false);

        // 2. Coba transfer ke Penipu (Pembeli)
        // EKSPEKTASI: SUKSES
        document.transferFrom(joko, penipu, 0);

        // Validasi: Berhasil pindah tangan
        assertEq(document.ownerOf(0), penipu);

        vm.stopPrank();
    }
}