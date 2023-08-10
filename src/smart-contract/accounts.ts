import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { S3T_TRADE_PROGRAM_ID } from "./program";
import * as anchor from '@project-serum/anchor';
import { dividendVaultSchema, sellerEscrowSchema, userShareAccountSchema, whitelistedNFTSchema } from "./decode";

export interface DividendVaultType {
  address: string,
  epoch: number,
  solDividendAmount: number,
  totalNShare: number
}


export const getDividendVaultInfoByEpoch = async (
  connection: Connection,
  epoch: number,
) => {
  const [dividendVault] = await PublicKey.findProgramAddress(
    [
      Buffer.from("dividend_vault"),
      new anchor.BN(epoch).toArrayLike(Buffer, "le", 8),
    ],
    S3T_TRADE_PROGRAM_ID
  );

  const accountInfo = await connection.getAccountInfo(dividendVault);
  const decodedData = dividendVaultSchema.decode(accountInfo?.data);
  console.log(decodedData)
  return {
    address: dividendVault.toBase58(),
    epoch: decodedData.epoch.toNumber(),
    solDividendAmount: decodedData.lamport_dividend_amount.toNumber() / LAMPORTS_PER_SOL,
    totalNShare: decodedData.total_n_share
  } as DividendVaultType
}

export const getAllDividendVaults = async (
  connection: Connection,
) => {
  const accounts = await connection.getParsedProgramAccounts(
    S3T_TRADE_PROGRAM_ID,
    {
      filters: [
        {
          dataSize: 8 + 8 + 8 + 2
        },
      ]
    }
  );

  if (accounts.length > 0) {
    const decodedAccounts = accounts.map((item) => {
      const decodedData = dividendVaultSchema.decode(item.account.data);
      return {
        address: item.pubkey.toBase58(),
        epoch: decodedData.epoch.toNumber(),
        solDividendAmount: decodedData.lamport_dividend_amount.toNumber() / LAMPORTS_PER_SOL,
        totalNShare: decodedData.total_n_share
      } as DividendVaultType
    });
    return decodedAccounts as DividendVaultType[]
  } else {
    return []
  }
}

export interface WhitelistedTokenType {
  address: string,
  tokenAddress: string,
  lastClaimedEpoch: number
}

export const getWhitelistedTokenInfo = async (
  connection: Connection,
  tokenAddress: PublicKey,
) => {
  const [whitelistNft] = await PublicKey.findProgramAddress(
    [
      Buffer.from('whitelist_nft'),
      tokenAddress.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );

  const accountInfo = await connection.getAccountInfo(whitelistNft);

  const decodedData = whitelistedNFTSchema.decode(accountInfo?.data);

  return {
    address: whitelistNft.toBase58(),
    tokenAddress: tokenAddress.toBase58(),
    lastClaimedEpoch: decodedData.last_claimed_epoch.toNumber()
  } as WhitelistedTokenType
}

export const getAllWhitelistedTokenInfos = async (
  connection: Connection,
) => {
  const accounts = await connection.getParsedProgramAccounts(
    S3T_TRADE_PROGRAM_ID,
    {
      filters: [
        {
          dataSize: 8 + 32 + 8
        },
      ]
    }
  );

  if (accounts.length > 0) {
    const decodedAccounts = accounts.map((item) => {
      const decodedData = whitelistedNFTSchema.decode(item.account.data);
      return {
        address: item.pubkey.toBase58(),
        tokenAddress: decodedData.token_address.toBase58(),
        lastClaimedEpoch: decodedData.last_claimed_epoch.toNumber()
      } as WhitelistedTokenType
    });
    return decodedAccounts as WhitelistedTokenType[]
  } else {
    return []
  }
}

export interface userShareAccountType {
  address: string,
  epoch: number,
  nShare: number
}

export const getUserShareAccountInfo = async (
  connection: Connection,
  epoch: number,
  user: PublicKey
) => {
  const [userShareAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from("user_share_account"),
      new anchor.BN(epoch).toArrayLike(Buffer, "le", 8),
      user.toBuffer()
    ], S3T_TRADE_PROGRAM_ID
  );
  const accountInfo = await connection.getAccountInfo(userShareAccount);
  console.log("usershare accountInfo", accountInfo);
  const decodedData = userShareAccountSchema.decode(accountInfo?.data);

  return {
    address: userShareAccount.toBase58(),
    epoch: decodedData.epoch.toNumber(),
    nShare: decodedData.n_share as number
  } as userShareAccountType
}

export const getUserAllShareAccountInfo = async (
  connection: Connection,
  owner: PublicKey
) => {
  const accounts = await connection.getParsedProgramAccounts(
    S3T_TRADE_PROGRAM_ID,
    {
      filters: [
        {
          dataSize: 8 + 8 + 2 + 32
        },
        {
          memcmp: {
            offset: 8 + 8 + 2,
            bytes: owner.toBase58()
          }
        }
      ]
    }
  );

  if (accounts.length > 0) {
    const decodedAccounts = accounts.map((item) => {
      const decodedData = userShareAccountSchema.decode(item.account.data);
      return {
        address: item.pubkey.toBase58(),
        epoch: decodedData.epoch.toNumber() as number,
        nShare: decodedData.n_share as number
      } as userShareAccountType
    });

    console.log(decodedAccounts)

    return decodedAccounts as userShareAccountType[]

  } else {
    return [] as userShareAccountType[]
  }
}

export interface SellerEscrowAccountInfo {
  address: string,
  escrowId: string,
  seller: string,
  tokenAddress: string,
  pricePerToken: number,
  amount: number
}

export const getAllSellerEscrowAccountsInfo = async (
  connection: Connection,
) => {
  const accounts = await connection.getParsedProgramAccounts(
    S3T_TRADE_PROGRAM_ID,
    {
      filters: [
        {
          dataSize: 8 + 32 + 32 + 32 + 8 + 8
        },
      ]
    }
  );

  if (accounts.length > 0) {
    const decodedAccounts = accounts.map((item) => {
      const decodedData = sellerEscrowSchema.decode(item.account.data);
      return {
        address: item.pubkey.toBase58(),
        escrowId: decodedData.escrow_id.toBase58() as string,
        seller: decodedData.seller.toBase58() as string,
        tokenAddress: decodedData.token_address.toBase58() as string,
        pricePerToken: (decodedData.price_per_token.toNumber() / LAMPORTS_PER_SOL) as number,
        amount: decodedData.amount.toNumber() as number
      } as SellerEscrowAccountInfo
    });

    console.log(decodedAccounts)

    return decodedAccounts

  } else {
    return [] as SellerEscrowAccountInfo[]
  }
}