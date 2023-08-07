import * as anchor from '@project-serum/anchor';
import { S3T_TRADE_PROGRAM_ID } from './program';
import { FtTrading } from "./program_types";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { checkAssociatedTokenAccount } from '../utils/web3';

export const createCreateDividendVaultInstruction = async (
  program: anchor.Program<anchor.Idl | FtTrading>,
  epoch: number,
  admin: PublicKey
) => {
  const [dividendVault] = await PublicKey.findProgramAddress(
    [
      Buffer.from("dividend_vault"),
      new anchor.BN(epoch).toArrayLike(Buffer, "le", 8),
    ],
    S3T_TRADE_PROGRAM_ID
  );

  const [dividendVaultWallet] = await PublicKey.findProgramAddress(
    [
      Buffer.from("dividend_vault_waller"),
      dividendVault.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  return program.methods.createDividendVault(
    new anchor.BN(epoch)
  ).accounts({
    dividendVault: dividendVault,
    dividendVaultWallet: dividendVaultWallet,
    admin: admin,
    systemProgram: SystemProgram.programId
  }).instruction()

}

export const createAddWhitelistNftIntruction = async (
  program: anchor.Program<anchor.Idl | FtTrading>,
  mintAddress: PublicKey,
  admin: PublicKey
) => {
  const [whitelistNft] = await PublicKey.findProgramAddress(
    [
      Buffer.from('whitelist_nft'),
      mintAddress.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  return program.methods.addWhitelistNft(
    mintAddress
  ).accounts({
    whitelistNft: whitelistNft,
    admin: admin,
    systemProgram: SystemProgram.programId
  }).instruction()
}

export const createResetWhitelistNftIntruction = async (
  program: anchor.Program<anchor.Idl | FtTrading>,
  tokenAddress: PublicKey,
  admin: PublicKey
) => {
  const [whitelistNft, bump] = await PublicKey.findProgramAddress(
    [
      Buffer.from('whitelist_nft'),
      tokenAddress.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );
  
  return program.methods.resetWhitelistNft(
    tokenAddress,
    bump
  ).accounts({
    whitelistNft: whitelistNft,
    admin: admin
  }).instruction()
}

export const createSellTransaction = async (
  connection: Connection,
  program: anchor.Program<anchor.Idl | FtTrading>,
  seller: PublicKey,
  tokenAddress: PublicKey,
  amount: number,
  pricePerToken: number
) => {
  const transaction = new Transaction();
  const escrowId = new Keypair();
  const [sellerEscrow] = await PublicKey.findProgramAddress(
    [
      Buffer.from("seller_escrow"),
      seller.toBuffer(),
      tokenAddress.toBuffer(),
      escrowId.publicKey.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  const sellerTokenAccount = await getAssociatedTokenAddress(
    tokenAddress, seller, false
  );

  const escrowTokenAccount = await getAssociatedTokenAddress(
    tokenAddress, sellerEscrow, true
  );

  const escrowTokenAccountCreated = await checkAssociatedTokenAccount(
    connection, tokenAddress, sellerEscrow
  );

  if (!escrowTokenAccountCreated) {
    const createTokenAccountIx = createAssociatedTokenAccountInstruction(
      seller,
      escrowTokenAccount,
      sellerEscrow,
      tokenAddress
    );
    transaction.add(createTokenAccountIx);
  }

  const programIx = await program.methods.sell(
    escrowId.publicKey,
    tokenAddress,
    new anchor.BN(amount),
    new anchor.BN(pricePerToken)
  ).accounts({
    sellerEscrow: sellerEscrow,
    seller: seller,
    systemProgram: SystemProgram.programId,
    sellerTokenAccount: sellerTokenAccount,
    escrowTokenAccount: escrowTokenAccount,
    tokenProgram: TOKEN_PROGRAM_ID
  }).instruction();

  transaction.add(programIx);

  return transaction
}

export const createBuyTransaction = async (
  connection: Connection,
  program: anchor.Program<anchor.Idl | FtTrading>,
  escrowId: PublicKey,
  seller: PublicKey,
  buyer: PublicKey,
  tokenAddress: PublicKey,
  amount: number,
  epoch: number,
) => {

  const transaction = new Transaction();

  const [sellerEscrow, sellerEscrowBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("seller_escrow"),
      seller.toBuffer(),
      tokenAddress.toBuffer(),
      escrowId.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  const buyerTokenAccount = await getAssociatedTokenAddress(
    tokenAddress, buyer, false
  );

  const buyerTokenAccountCreated = await checkAssociatedTokenAccount(
    connection, tokenAddress, buyer
  );

  if (!buyerTokenAccountCreated) {
    const createTokenAccountIx = createAssociatedTokenAccountInstruction(
      buyer,
      buyerTokenAccount,
      buyer,
      tokenAddress
    );
    transaction.add(createTokenAccountIx);
  }

  const escrowTokenAccount = await getAssociatedTokenAddress(
    tokenAddress, sellerEscrow, true
  );

  const [dividendVault, dividendVaultBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("dividend_vault"),
      new anchor.BN(epoch).toArrayLike(Buffer, "le", 8),
    ],
    S3T_TRADE_PROGRAM_ID
  );

  const [dividendVaultWallet, dividendVaultWalletBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("dividend_vault_waller"),
      dividendVault.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  const programIx = await program.methods.buy(
    escrowId,
    tokenAddress,
    new anchor.BN(amount),
    sellerEscrowBump,
    new anchor.BN(epoch),
    dividendVaultBump,
    dividendVaultWalletBump
  ).accounts({
    sellerEscrow: sellerEscrow,
    seller: seller,
    buyer: buyer,
    buyerTokenAccount: buyerTokenAccount,
    escrowTokenAccount: escrowTokenAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    dividendVault: dividendVault,
    dividendVaultWallet: dividendVaultWallet
  }).instruction();

  transaction.add(programIx);

  return transaction

}

export const createCreateShareAccountIntruction = async (
  program: anchor.Program<anchor.Idl | FtTrading>,
  epoch: number,
  owner: PublicKey
) => {
  const [userShareAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from("user_share_account"),
      new anchor.BN(epoch).toArrayLike(Buffer, "le", 8),
      owner.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  return program.methods.createShareAccount(new anchor.BN(epoch))
  .accounts({
    userShareAccount: userShareAccount,
    owner: owner,
    systemProgram: SystemProgram.programId,
  }).instruction()
}

export const createClaimShareInstruction = async (
  program: anchor.Program<anchor.Idl | FtTrading>,
  epoch: number,
  owner: PublicKey,
  tokenAddress: PublicKey
) => {
  const [userShareAccount, userShareAccountBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("user_share_account"),
      new anchor.BN(epoch).toArrayLike(Buffer, "le", 8),
      owner.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  ); 

  const [dividendVault, dividendVaultBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("dividend_vault"),
      new anchor.BN(epoch).toArrayLike(Buffer, "le", 8),
    ],
    S3T_TRADE_PROGRAM_ID
  );

  const [whitelistedNft, whitelistedNftBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from('whitelist_nft'),
      tokenAddress.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  const userTokenAccount = await getAssociatedTokenAddress(
    tokenAddress, owner, false
  );

  return program.methods.claimShare(
    new anchor.BN(epoch),
    userShareAccountBump,
    dividendVaultBump,
    whitelistedNftBump
  ).accounts({
    userShareAccount: userShareAccount,
    owner: owner,
    dividendVault: dividendVault,
    whitelistedNft: whitelistedNft,
    userTokenAccount: userTokenAccount
  }).instruction()
}

export const createClaimDividendIntruction = async (
  program: anchor.Program<anchor.Idl | FtTrading>,
  owner:PublicKey,
  epoch: number
) => {
  const [userShareAccount, userShareAccountBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("user_share_account"),
      new anchor.BN(epoch).toArrayLike(Buffer, "le", 8),
      owner.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  ); 

  const [dividendVault, dividendVaultBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("dividend_vault"),
      new anchor.BN(epoch).toArrayLike(Buffer, "le", 8),
    ],
    S3T_TRADE_PROGRAM_ID
  );

  const [dividendVaultWallet, dividendVaultWalletBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("dividend_vault_waller"),
      dividendVault.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  return program.methods.claimDividend(
    new anchor.BN(epoch),
    userShareAccountBump,
    dividendVaultBump,
    dividendVaultWalletBump
  ).accounts({
    userShareAccount: userShareAccount,
    owner: owner,
    dividendVault: dividendVault,
    dividendVaultWallet: dividendVaultWallet
  })
}

export const createForceCloseIx = async (
  program: anchor.Program<anchor.Idl | FtTrading>,
  admin: PublicKey,
  escrowId: PublicKey,
  seller: PublicKey,
  tokenAddress: PublicKey,
) => {
  const [sellerEscrow, bump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("seller_escrow"),
      seller.toBuffer(),
      tokenAddress.toBuffer(),
      escrowId.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  return program.methods.forceCloseSell(
    escrowId,
    tokenAddress,
    seller,
    bump
  ).accounts({
    sellerEscrow: sellerEscrow,
    admin: admin
  }).instruction()
}


