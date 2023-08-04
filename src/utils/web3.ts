import { PublicKey, Connection } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
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