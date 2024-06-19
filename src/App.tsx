import { ReactNode, useMemo, FC, useEffect } from 'react'
import './App.css'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PublicKey, clusterApiUrl } from '@solana/web3.js';
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
import { IDL } from './smart-contract/program_types';
import { S3T_TRADE_PROGRAM_ID } from './smart-contract/program';
import { EPOCH_DURATION, START_TS, getNFTOnchainMetadata, getSolanaTime, getUserTokens } from './utils/web3';
import { getAllDividendVaults, getAllSellerEscrowAccountsInfo, getAllWhitelistedTokenInfos } from './smart-contract/accounts';
import { useProgramData } from './stores/useProgramData';
import { useLoading } from './stores/useLoading';
import { useState } from "react";
import NewUserModal from './components/Modal/NewUserModal';

import Hotjar from '@hotjar/browser';
import { getAssociatedTokenAddress } from '@solana/spl-token';

function App() {

  const [showNewUserModal, setShowNewUserModal] = useState<boolean>(false);

  useEffect(() => {
    const hideNewUserModal = localStorage.getItem("hideNewUserModal");
    if (!hideNewUserModal || (hideNewUserModal == "false")) {
      setShowNewUserModal(true)
    }

    console.log('add hotjar')
    
    Hotjar.init(3792866, 6, {
      debug: true
    });

    if (Hotjar.isReady()) {
      console.log('hot jar ready')
    }


  }, [])


  return (
    <WalletAdapterContext>
      <Navbar />
      <NewUserModal
        isOpen={showNewUserModal}
        onClose={() => { setShowNewUserModal(false) }}
      />
      <WrappedApp />
    </WalletAdapterContext>
  )
}

function WrappedApp() {
  const wallet = useAnchorWallet();

  const {
    connection,
    program,
    setProgram,
    setUserTokens,
    setCurrEpoch
  } = useWeb3();
  const { setLoading } = useLoading();
  const {
    setAllWhiteListedTokenInfo,
    setAllDividendVaultInfos,
    setAllSellEscrowInfo
  } = useProgramData()

  useEffect(() => {

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

  }, [wallet?.publicKey]);

  useEffect(() => {
    getSolanaTime(connection)
      .then((solanaTime) => {
        console.log('solanaTime: ', solanaTime)
        const epoch = Math.floor((solanaTime! - START_TS) / EPOCH_DURATION);
        setCurrEpoch(epoch);
      })
  }, [])

  useEffect(() => {
    if (wallet?.publicKey && connection) {
      getUserTokensInfo();
    }
  }, [wallet?.publicKey])

  const getUserTokensInfo = async () => {
    try {
    const tokensInfo = await getUserTokens(
      wallet?.publicKey.toBase58()!,
      connection
    );
    const nonEmptyTokens = tokensInfo.filter((item) => item.tokenBalance > 0);
    const tokensData = await Promise.all(nonEmptyTokens.map(async (item) => {
      const onChainMetadata = await getNFTOnchainMetadata(
        new PublicKey(item.mintAddress),
        connection
      );

      if (onChainMetadata) {
        const respOffChainMetadata = await fetch(onChainMetadata.data.uri);
        const offChainMetadata = await respOffChainMetadata.json();
        const imageUrl = offChainMetadata.image as string;
        return {
          imageUrl: imageUrl,
          name: onChainMetadata.data.name,
          tokenAddress: item.mintAddress,
          tokenBalance: item.tokenBalance
        }
      }
      return {
        imageUrl: null,
        name: null,
        tokenAddress: item.mintAddress,
        tokenBalance: item.tokenBalance
      }
    }));
    console.log('tokensData: ', tokensData)
    setUserTokens(tokensData)
  } catch (err) {
    console.log(err)
  }

  }

  useEffect(() => {
    if (program && connection) {
      getProgramData();
    }
  }, [program])

  const getProgramData = async () => {

    //due to limit of rpc free tier we have to fetch data like this

    setLoading(true);

    const dataArrWL = await getAllWhitelistedTokenInfos(connection);
    setAllWhiteListedTokenInfo(dataArrWL);

    const dataArrDV = await getAllDividendVaults(connection);
    console.log("dataArrDV: ", dataArrDV.sort((a, b) => a.epoch - b.epoch))
    setAllDividendVaultInfos(dataArrDV);

    const dataArrSE = await getAllSellerEscrowAccountsInfo(connection);
    setAllSellEscrowInfo(dataArrSE);

    setLoading(false);

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
