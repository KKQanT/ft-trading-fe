import { PublicKey, Connection, Keypair, Transaction, SystemProgram } from "@solana/web3.js";
import { MintLayout, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMint2Instruction, createInitializeMintInstruction, createMintToInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptAccount, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

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

export const START_TS = 1691217723;
export const EPOCH_DURATION = 86400

export const METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

export const mintToken = async (
  connection: Connection,
  payer: PublicKey,
  mintKeypair: Keypair,
  metadataUri: string,
  amount: number,
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