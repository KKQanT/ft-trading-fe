import { ReactNode, useMemo, FC, useState, useEffect } from 'react'
import './App.css'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import Navbar from './components/Navber/Navbar';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home/Home';
import TradingPage from './components/Trade/TradePage';
import InvestorSection from './components/Investor/InvestorSection';
import AdminPage from './components/Admin';

import "@solana/wallet-adapter-react-ui/styles.css"
import TokenService from './components/TokenService';
import { useWeb3 } from './stores/useWeb3';

import * as anchor from '@project-serum/anchor';
import { FtTrading, IDL } from './smart-contract/program_types';
import { S3T_TRADE_PROGRAM_ID } from './smart-contract/program';
import { getUserTokens } from './utils/web3';
import { getAllDividendVaults, getAllWhitelistedTokenInfos } from './smart-contract/accounts';
import { useProgramData } from './stores/useProgramData';


function App() {
  return (
    <WalletAdapterContext>
      <Navbar />
      <WrappedApp />
    </WalletAdapterContext>
  )
}

function WrappedApp() {
  const wallet = useAnchorWallet();

  const { connection, program, setProgram, setUserTokens } = useWeb3()
  const {
    setAllWhiteListedTokenInfo, 
    setAllDividendVaultInfos
  } = useProgramData()

  useEffect(() => {
    if (wallet?.publicKey) {
      const provider = new anchor.AnchorProvider(
        connection,
        wallet as anchor.Wallet,
        {}
      );
      anchor.setProvider(provider);

      const program = new anchor.Program(
        IDL as anchor.Idl,
        S3T_TRADE_PROGRAM_ID
      );
      setProgram(program);
    }
  }, [wallet?.publicKey]);

  useEffect(() => {
    if (wallet?.publicKey && connection) {
      getUserTokens(
        wallet.publicKey.toBase58(), connection
      ).then((dataArr) => {
        const filteredDataArr = dataArr.filter((item) => item.tokenBalance > 0)
        setUserTokens(filteredDataArr)
      }).catch((err) => { console.log(err) })
    }
  }, [wallet?.publicKey])

  useEffect(() => {
    if (program && connection) {
      getProgramData();
    }
  }, [program])



  const getProgramData = async () => {

    //due to limit of rpc free tier we have to fetch data like this

    const dataArrWL = await getAllWhitelistedTokenInfos(connection);
    setAllWhiteListedTokenInfo(dataArrWL);

    const dataArrDV = await getAllDividendVaults(connection);
    setAllDividendVaultInfos(dataArrDV);
  }

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="trade" element={<TradingPage />} />
      <Route path='investor' element={<InvestorSection />} />
      <Route path='admin' element={<AdminPage />} />
      <Route path='token-service' element={<TokenService />} />
    </Routes>
  )

}

const WalletAdapterContext: FC<{ children: ReactNode }> = (
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

export default App
