import * as anchor from '@project-serum/anchor';
import { S3T_TRADE_PROGRAM_ID } from './program';
import {FtTrading} from "./types";
import { PublicKey, SystemProgram } from '@solana/web3.js';

export const createDividendVault = async (
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

