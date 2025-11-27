// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

interface IIssuerRegistry {
    function isIssuer(address _account) external view returns (bool);
}

contract HybridDocument is ERC721, ERC721URIStorage, Ownable {
    
    uint256 private _nextTokenId;
    IIssuerRegistry public issuerRegistry;

    mapping(uint256 => bool) public isSoulbound;
    
    // TAMBAHAN: Mapping untuk menandai dokumen ini "Verified Issuer" atau "Public"
    // TokenID => True (Resmi/Centang Biru) / False (Public/User Biasa)
    mapping(uint256 => bool) public isVerifiedIssuer;

    event DocumentMinted(uint256 indexed tokenId, address indexed to, bool isSoulbound, bool isVerified);

    constructor(address _registryAddress) ERC721("Hybrid Academic Document", "HAD") Ownable(msg.sender) {
        issuerRegistry = IIssuerRegistry(_registryAddress);
    }

    // --- FUNGSI 1: UNTUK INSTITUSI (Verified) ---
    // (Hanya bisa dipanggil oleh Kampus/Mitra)
    function mintOfficialDocument(address to, string memory uri, bool _soulbound) public {
        require(issuerRegistry.isIssuer(msg.sender), "Hanya Issuer resmi!");
        _createToken(to, uri, _soulbound, true); // True = Verified
    }

    // --- FUNGSI 2: UNTUK JOKO (Public) ---
    // (Bisa dipanggil siapa saja, tanpa syarat)
    function mintPublicDocument(string memory uri, bool _soulbound) public {
        // Joko minting untuk dirinya sendiri (msg.sender)
        // False = Unverified (Self-Signed)
        _createToken(msg.sender, uri, _soulbound, false); 
    }

    // --- FUNGSI INTERNAL (Dapur Pencetakan) ---
    function _createToken(address to, string memory uri, bool _soulbound, bool _verified) internal {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        isSoulbound[tokenId] = _soulbound;
        isVerifiedIssuer[tokenId] = _verified; // Simpan status centang biru/tidak

        emit DocumentMinted(tokenId, to, _soulbound, _verified);
    }

    // ... (Sisa fungsi _update dan tokenURI sama seperti sebelumnya) ...
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (isSoulbound[tokenId] && from != address(0) && to != address(0)) {
            revert("Error: Dokumen ini bersifat Soulbound dan tidak bisa dipindahtangankan!");
        }
        return super._update(to, tokenId, auth);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}