import { ReactNode, useMemo, FC } from 'react'
import './App.css'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import Navbar from './components/Navber/Navbar';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home/Home';
import TradingPage from './components/Trade/TradePage';

import "@solana/wallet-adapter-react-ui/styles.css"

const WalleAdapterContext: FC<{ children: ReactNode }> = (
  { children }: { children: ReactNode }
) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function App() {

  return (
    <WalleAdapterContext>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="trade" element={<TradingPage />} />
      </Routes>
    </WalleAdapterContext>
  )
}

export default App
