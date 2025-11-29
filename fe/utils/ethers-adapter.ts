import { useMemo } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useWalletClient } from 'wagmi';

/**
 * Hook ini mengubah 'Wallet Client' dari Wagmi (Viem)
 * menjadi 'Signer' dari Ethers.js v6 supaya kompatibel sama kode lama kamu.
 */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });

  return useMemo(() => {
    if (!walletClient) return undefined;

    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    
    // Bikin Provider Ethers v6
    const provider = new BrowserProvider(transport, network);
    // Bikin Signer Ethers v6
    const signer = new JsonRpcSigner(provider, account.address);

    return signer;
  }, [walletClient]);
}