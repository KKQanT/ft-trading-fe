import * as borsh from '@project-serum/borsh';


export const userShareAccountSchema = borsh.struct([
    borsh.u64('discriminator'),
    borsh.u64('epoch'),
    borsh.u64('reward_share'),
    borsh.publicKey('owner'),
])

export const dividendVaultSchema = borsh.struct([
    borsh.u64('discriminator'),
    borsh.u64('epoch'),
    borsh.u64('lamport_dividend_amount'),
    borsh.u64('total_share'),
])

export const sellerEscrowSchema = borsh.struct([
    borsh.u64('discriminator'),
    borsh.u64('epoch'),
    borsh.u64('lamport_dividend_amount'),
    borsh.u64('total_share'),
])

export const whitelistedNFTSchema = borsh.struct([
    borsh.u64('discriminator'),
    borsh.publicKey('owner'),
    borsh.i64("last_claim_ts")
])

