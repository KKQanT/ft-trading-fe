import * as borsh from '@project-serum/borsh';

export const dividendVaultSchema = borsh.struct([
    borsh.u64('discriminator'),
    borsh.u64('epoch'),
    borsh.u64('lamport_dividend_amount'),
    borsh.u64('total_n_share'),
])

export const whitelistedNFTSchema = borsh.struct([
    borsh.u64('discriminator'),
    borsh.publicKey('token_address'),
    borsh.i64("last_claimed_epoch")
])

export const userShareAccountSchema = borsh.struct([
    borsh.u64('discriminator'),
    borsh.u64('epoch'),
    borsh.u64('n_share'),
    borsh.publicKey('owner'),
])

export const sellerEscrowSchema = borsh.struct([
    borsh.u64('discriminator'),
    borsh.publicKey('escrow_id'),
    borsh.publicKey('seller'),
    borsh.publicKey('token_address'),
    borsh.u64('price_per_token'),
    borsh.u64('amount'),
])

