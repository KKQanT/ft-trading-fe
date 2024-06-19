import { PublicKey, Connection, Keypair, Transaction, SystemProgram } from "@solana/web3.js";
import { MintLayout, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, createMintToInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";
import { Metadata, createCreateMetadataAccountV3Instruction, createUpdateMetadataAccountV2Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { GetProgramAccountsFilter } from "@solana/web3.js";

export const START_TS = 1717861000
export const EPOCH_DURATION = 86400 * 30

export async function checkAssociatedTokenAccount(
  connection: Connection,
  tokenAddress: PublicKey,
  owner: PublicKey,
) {
  try {
    const associatedTokenAccount = await getAssociatedTokenAddress(tokenAddress, owner, true);
    const accountInfo = await connection.getAccountInfo(associatedTokenAccount);
    if (!accountInfo) {
      return false
    } else {
      return true
    }
  } catch (err) {
    console.log(err)
    alert('cannot check your associated token account')
    return true
  }
}

export const getSolanaTime = async (connection: Connection) => {
  const slot = await connection.getSlot();
  const nowTs = await connection.getBlockTime(slot);
  return nowTs
}

export const METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

export const createMintTokenTransaction = async (
  connection: Connection,
  payer: PublicKey,
  mintKeypair: Keypair,
  amount: number,
  metadataUri: string,
  name: string,
  symbol: string

) => {
  const mintTransaction = new Transaction();

  const mintBalanceNeeded = await getMinimumBalanceForRentExemptMint(connection);

  mintTransaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair.publicKey,
      lamports: mintBalanceNeeded,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID
    })
  );

  mintTransaction.add(
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      0,
      payer,
      payer,
      TOKEN_PROGRAM_ID
    )
  );

  const associatedTokenAccount = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    payer
  );

  const createAssociatedTokenAccountIx = await createAssociatedTokenAccountInstruction(
    payer, associatedTokenAccount, payer, mintKeypair.publicKey
  );

  mintTransaction.add(createAssociatedTokenAccountIx);

  const mintToIx = createMintToInstruction(
    mintKeypair.publicKey,
    associatedTokenAccount,
    payer,
    amount
  );

  mintTransaction.add(mintToIx);

  if ((metadataUri == "") || (name == "") || (symbol == "")) {
    return mintTransaction
  }

  const [metadataAddress] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      (new PublicKey(METADATA_PROGRAM_ID)).toBuffer(),
      mintKeypair.publicKey.toBuffer()
    ],
    new PublicKey(METADATA_PROGRAM_ID)
  )

  const metadataIx = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataAddress,
      mint: mintKeypair.publicKey,
      mintAuthority: payer,
      payer: payer,
      updateAuthority: payer
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: name,
          symbol: symbol,
          uri: metadataUri,
          sellerFeeBasisPoints: 1000,
          creators: [
            {
              address: payer,
              verified: true,
              share: 100
            }
          ],
          collection: null,
          uses: null
        },
        isMutable: true,
        collectionDetails: null
      }
    }
  );

  mintTransaction.add(metadataIx)

  return mintTransaction

}

export interface UserTokenType {
  tokenAddress: string,
  tokenBalance: number,
  name: string | null,
  imageUrl: string | null
}

export const getUserTokens = async (wallet: string, solanaConnection: Connection) => {
  const filters: GetProgramAccountsFilter[] = [
    {
      dataSize: 165,    //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32,     //location of our query in the account (bytes)
        bytes: wallet,  //our search criteria, a base58 encoded string
      },
    }];
  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    { filters: filters }
  );

  const dataArr = accounts.map((account) => {
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

    return {
      mintAddress: mintAddress,
      tokenBalance: tokenBalance
    }
  });

  return dataArr
}

export const createUpdateMetadataIx = async (
  tokenAddress: PublicKey,
  name: string,
  symbol: string,
  uri: string,
  payer: PublicKey
) => {
  const [metadataAddress] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      (new PublicKey(METADATA_PROGRAM_ID)).toBuffer(),
      tokenAddress.toBuffer()
    ],
    new PublicKey(METADATA_PROGRAM_ID)
  );

  const data = {
    name: name,
    symbol: symbol,
    uri: uri,
    sellerFeeBasisPoints: 1000,
    creators: [
      {
        address: payer,
        verified: true,
        share: 100
      }
    ],
    collection: null,
    uses: null
  }

  const updateMetadataIx = createUpdateMetadataAccountV2Instruction(
    {
      metadata: metadataAddress,
      updateAuthority: payer
    },
    {
      updateMetadataAccountArgsV2: {
        data: data,
        updateAuthority: payer,
        primarySaleHappened: true,
        isMutable: true
      }
    }
  );

  return updateMetadataIx

}

export async function getMetadataPDA(
  mint: PublicKey
): Promise<[PublicKey, number]> {

  const [metadataPDA, metadataBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      (new PublicKey(METADATA_PROGRAM_ID)).toBuffer(),
      (new PublicKey(mint)).toBuffer()
    ],
    new PublicKey(METADATA_PROGRAM_ID)
  );
  return [metadataPDA, metadataBump]
}

export async function getNFTOnchainMetadata(
  mintAddress: PublicKey,
  connection: Connection
): Promise<Metadata | null> {
  try {
    const [metadataPDA] = await getMetadataPDA(mintAddress);
    let onChainMetadata = await Metadata.fromAccountAddress(connection, metadataPDA);
    onChainMetadata.data.name = onChainMetadata.data.name.replace(/\u0000/g, '');
    onChainMetadata.data.symbol = onChainMetadata.data.symbol.replace(/\u0000/g, '');
    onChainMetadata.data.uri = onChainMetadata.data.uri.replace(/\u0000/g, '');
    return onChainMetadata
  } catch (err) {
    return null
  }
}