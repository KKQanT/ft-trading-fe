import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { S3T_TRADE_PROGRAM_ID } from "./program";
import * as anchor from '@project-serum/anchor';
import { dividendVaultSchema, sellerEscrowSchema, userShareAccountSchema, whitelistedNFTSchema } from "./decode";

export interface DividendVaultType {
  address: string,
  epoch: number,
  solDividendAmount: number,
  totalShare: number
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
    totalShare: decodedData.total_share.toNumber()
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
          dataSize: 8 + 8 * 3
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
        totalShare: decodedData.total_share.toNumber()
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
  lastClaimedTs: number
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
    lastClaimedTs: decodedData.last_claim_ts.toNumber()
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
        lastClaimedTs: decodedData.last_claim_ts.toNumber()
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
  rewardShare: number
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
  const decodedData = userShareAccountSchema.decode(accountInfo?.data);

  return {
    address: userShareAccount.toBase58(),
    epoch: decodedData.epoch.toNumber(),
    rewardShare: decodedData.epoch.toNumber(),
  } as userShareAccountType
}

interface SellerEscrowAccountInfo {
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
        pricePerToken: decodedData.price_per_token.toNumber() as number,
        amount: decodedData.amount.toNumber() as number
      } as SellerEscrowAccountInfo
    });

    return decodedAccounts

  } else {
    return [] as SellerEscrowAccountInfo[]
  }
}