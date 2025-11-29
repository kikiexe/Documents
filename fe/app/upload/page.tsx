"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/utils/ethers-adapter";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/utils/ipfs";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import HybridToggle from "@/components/HybridToggle";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function UploadPage() {
  // 1. Ambil data dari RainbowKit/Wagmi
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner(); // Dapet signer otomatis!

  const [recipient, setRecipient] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [isSoulbound, setIsSoulbound] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [documentHash, setDocumentHash] = useState<string>("");

  // Otomatis isi recipient dengan address sendiri saat login
  useEffect(() => {
    if (address) setRecipient(address);
  }, [address]);

  // ... (Fungsi calculateHash dan handleFileChange TETAP SAMA) ...
  const calculateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // ... (Kode sama kayak sebelumnya) ...
      const selectedFile = e.target.files?.[0];
      if (selectedFile) setFile(selectedFile);
  };

  const handleMint = async () => {
    if (!file || !address || !signer) return alert("Wallet belum terkoneksi!");
    if (!recipient) return alert("Address penerima kosong!");

    setLoading(true);
    setStatus("🚀 Memulai proses...");

    try {
      // 1. Hash & IPFS (Sama)
      const docHash = await calculateHash(file);
      setDocumentHash(docHash);
      const fileCid = await uploadFileToIPFS(file);
      
      const metadata = {
        name: form.name,
        description: form.description,
        document: fileCid,
        attributes: [
          { trait_type: "Type", value: isSoulbound ? "SBT" : "NFT" },
          { trait_type: "Issuer", value: address },
          { trait_type: "Hash", value: docHash }
        ],
      };
      const metadataCid = await uploadJSONToIPFS(metadata);

      // 2. Blockchain (BEDANYA DISINI LEBIH SIMPEL)
      // Kita gak perlu 'new ethers.BrowserProvider' lagi.
      // Signer sudah disediakan oleh RainbowKit lewat adapter kita.
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer // <-- Langsung pakai signer dari hook
      );

      let tx;
      try {
        tx = await contract.mintOfficialDocument(recipient, metadataCid, isSoulbound, docHash);
        setStatus("🏛️ Mencetak Dokumen Resmi...");
      } catch (err) {
        console.log("Switching to public mint...");
        tx = await contract.mintPublicDocument(metadataCid, isSoulbound, docHash);
        setStatus("👤 Mencetak Dokumen Pribadi...");
      }

      await tx.wait();
      setStatus("✅ SUKSES! Dokumen tercatat.");
      alert("Berhasil!");
      
    } catch (error: any) {
      console.error(error);
      setStatus("❌ Gagal: " + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">📄 Upload Dokumen</h2>
        </div>

        <div className="p-8">
          {/* GANTI BAGIAN CONNECT DENGAN RAINBOWKIT */}
          <div className="mb-8 flex justify-center">
            <ConnectButton label="Hubungkan Wallet untuk Mulai" />
          </div>

          {/* Tampilkan Form HANYA jika sudah connect */}
          {isConnected ? (
            <div className="space-y-5">
               {/* ... (Isi Form Sama Persis dengan Sebelumnya) ... */}
               {/* Input Recipient, Judul, File, Toggle, Button Mint */}
               
               {/* Contoh tombol mint */}
               <button
                  onClick={handleMint}
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {loading ? "Memproses..." : "Cetak Dokumen"}
               </button>

               {status && <p className="text-center mt-4">{status}</p>}
            </div>
          ) : (
            <p className="text-center text-gray-500">Silakan hubungkan wallet Anda terlebih dahulu.</p>
          )}
        </div>
      </div>
    </div>
  );
}