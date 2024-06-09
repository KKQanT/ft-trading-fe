# Token Trading Platform with On-chain Dividend System

This is the frontend implementation to interact with the deployed on-chain program on devnet : [S3TX6wejVn7n9d7CPtLySdBaaTgu8RdMCByrCDpEkR4](https://solscan.io/account/S3TX6wejVn7n9d7CPtLySdBaaTgu8RdMCByrCDpEkR4?cluster=devnet)

The website was lived at https://s3t-trade.vercel.app/. If you wished to test it out you have to

- Download custodial wallet extension such as [Phantom](https://phantom.app/), [Solfare](https://solflare.com/), ...etc. If you don't have one.
- Switch your network on Phantom to "testnet".
- You can run solana cli or write an airdrop function if you are technical to airdrop SOL to your wallet [doc](https://www.quicknode.com/guides/solana-development/getting-started/a-complete-guide-to-airdropping-test-sol-on-solana). 
- If you are non technical you can visit this [website](https://solfaucet.com/) for sol airdrop on devnet
- If you wish to try token listing features you can create your own token following [this](https://spl.solana.com/token) or using my [token service](https://s3t-trade.vercel.app/token-service) to mint tokens.
- If you want the shared-holder NFTs to try out claiming dividend features, just ping me.

## UI Improvement (TO DO)
- Re-Design landing page
- Add Stripe payment to purchase SOL off-chain using real world money
- Token-Price aggregration (like other usual stock trading platforms)
- Tutorial page
- Improve Token Service Page
- Some components are still not mobile optimized
- Improve On-Chain Status components 

## To do
- improve data loading (all Epoch Dovidend Account)