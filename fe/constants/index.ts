// fe/constants/index.ts

// 1. Alamat Kontrak (NANTI DIUPDATE SETELAH DEPLOY)
export const REGISTRY_ADDRESS = "0x0000000000000000000000000000000000000000"; 
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

// 2. ABI untuk Smart Contract Utama (HybridDocument)
// (Ini kerangka standar ERC-721 + Fungsi Custom kita)
export const CONTRACT_ABI = [
  "function mintOfficialDocument(address to, string uri, bool soulbound, bytes32 hash) external",
  "function mintPublicDocument(string uri, bool soulbound, bytes32 hash) external",
  "function verifyByHash(bytes32 hash) external view returns (bool, uint256, address, address, string, tuple(bytes32, address, uint256, bool, bool, bool))",
  "function revokeDocument(uint256 tokenId) external",
  "function getDocumentData(uint256 tokenId) external view returns (tuple(bytes32, address, uint256, bool, bool, bool))",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function ownerOf(uint256 tokenId) external view returns (address)"
];

// 3. ABI untuk Registry (AccessControl)
// (Ini yang KEMARIN KURANG, makanya Admin Page error)
export const REGISTRY_ABI = [
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function addIssuer(address _issuer, string _name)",
  "function setIssuerStatus(address _issuer, bool _status)",
  "function isIssuer(address _account) view returns (bool)",
  "function getIssuerName(address _account) view returns (string)",
  "function GOVERNANCE_ROLE() view returns (bytes32)"
];