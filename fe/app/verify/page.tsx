"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import { Search, CheckCircle, XCircle, FileText, ExternalLink, Copy } from "lucide-react";

// Saweria Styles
const cardStyle = `border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg bg-white p-6`;
const inputStyle = `w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white font-bold`;

export default function VerifyPage() {
  const [tokenId, setTokenId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenId) return;
    
    setLoading(true);
    setError("");
    setData(null);

    try {
      // Read-Only Provider (Arbitrum Sepolia Public RPC)
      const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // 1. Get Core Data
      const docData = await contract.getDocumentData(tokenId);
      const owner = await contract.ownerOf(tokenId);
      const uri = await contract.tokenURI(tokenId);

      // 2. Metadata IPFS
      const httpUri = uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      const metaRes = await fetch(httpUri);
      const metadata = await metaRes.json();

      setData({
        tokenId,
        owner,
        issuer: docData.issuer,
        isSoulbound: docData.isSoulbound,
        isVerified: docData.isVerified,
        isRevoked: docData.isRevoked,
        timestamp: new Date(Number(docData.timestamp) * 1000).toLocaleDateString("id-ID", { dateStyle: 'full' }),
        metadata,
        hash: docData.documentHash
      });

    } catch (err: any) {
        console.error(err);
        setError("Token ID tidak ditemukan atau terjadi kesalahan jaringan.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] pb-20 pt-8 font-sans text-slate-900">
      <main className="mx-auto max-w-2xl px-4">
        
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-black mb-2">Cek Keaslian Dokumen</h1>
            <p className="font-medium text-gray-600">Masukkan Token ID untuk melacak jejak digital di Blockchain.</p>
        </div>

        <form onSubmit={handleVerify} className="relative mb-8">
            <input 
                type="number" 
                placeholder="Masukkan Token ID (Contoh: 1)" 
                className={`${inputStyle} pr-24`}
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
            />
            <button 
                type="submit" 
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 rounded bg-black text-white px-6 font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
                {loading ? "..." : "Cari"}
            </button>
        </form>

        {error && (
            <div className="bg-red-100 border-2 border-black p-4 rounded-lg font-bold text-red-800 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <XCircle /> {error}
            </div>
        )}

        {data && (
            <div className={`${cardStyle} animate-in slide-in-from-bottom-4`}>
                
                {/* Status Badge Header */}
                <div className={`-mt-10 mb-6 mx-auto w-fit px-6 py-2 border-2 border-black rounded-full font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 ${data.isRevoked ? 'bg-red-500 text-white' : (data.isVerified ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700')}`}>
                    {data.isRevoked ? (
                        <>⛔ DOKUMEN DIBATALKAN</>
                    ) : data.isVerified ? (
                        <><CheckCircle size={16}/> OFFICIAL VERIFIED</>
                    ) : (
                        <>👤 SELF-SIGNED (PUBLIC)</>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="text-center border-b-2 border-gray-100 pb-4">
                        <h2 className="text-2xl font-black">{data.metadata?.name || "Dokumen Tanpa Judul"}</h2>
                        <p className="text-gray-500 font-medium">{data.metadata?.description}</p>
                    </div>

                    {/* Grid Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <InfoBox label="TIPE TOKEN" value={data.isSoulbound ? "🔒 Soulbound (SBT)" : "💸 Transferable (NFT)"} color="bg-yellow-100" />
                        <InfoBox label="TANGGAL TERBIT" value={data.timestamp} color="bg-cyan-100" />
                    </div>

                    {/* Issuer & Owner */}
                    <div className="space-y-3">
                        <AddressBox label="DITERBITKAN OLEH" address={data.issuer} />
                        <AddressBox label="PEMILIK SAAT INI" address={data.owner} />
                    </div>

                    {/* Hash & IPFS */}
                    <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs break-all relative group border-2 border-black">
                        <p className="text-gray-500 mb-1 font-sans font-bold text-[10px] uppercase">Digital Fingerprint (SHA-256)</p>
                        {data.hash}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <a 
                            href={data.metadata?.document ? data.metadata.document.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") : "#"} 
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-2 border-2 border-black bg-white py-3 rounded-lg font-bold hover:bg-gray-50 shadow-[2px_2px_0px_0px_black] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            <FileText size={18} /> Lihat PDF
                        </a>
                        <a 
                            href={`https://sepolia.arbiscan.io/token/${CONTRACT_ADDRESS}?a=${tokenId}`} 
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-2 border-2 border-black bg-[#fbbf24] py-3 rounded-lg font-bold hover:bg-yellow-400 shadow-[2px_2px_0px_0px_black] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            <ExternalLink size={18} /> Blockchain
                        </a>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

function InfoBox({ label, value, color }: any) {
    return (
        <div className={`p-3 rounded border-2 border-black ${color}`}>
            <p className="text-[10px] font-bold text-gray-600 mb-1">{label}</p>
            <p className="font-bold text-sm">{value}</p>
        </div>
    )
}

function AddressBox({ label, address }: any) {
    return (
        <div>
            <p className="text-xs font-bold text-gray-500 mb-1 ml-1">{label}</p>
            <div className="font-mono text-xs bg-gray-100 p-3 rounded border-2 border-gray-300 break-all">
                {address}
            </div>
        </div>
    )
}