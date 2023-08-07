export type FtTrading = {
  "version": "0.1.0",
  "name": "ft_trading",
  "instructions": [
    {
      "name": "createDividendVault",
      "accounts": [
        {
          "name": "dividendVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dividendVaultWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addWhitelistNft",
      "accounts": [
        {
          "name": "whitelistNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mintAddress",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "resetWhitelistNft",
      "accounts": [
        {
          "name": "whitelistNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "mintAddress",
          "type": "publicKey"
        },
        {
          "name": "whitelistNftBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "sell",
      "accounts": [
        {
          "name": "sellerEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sellerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "escrowId",
          "type": "publicKey"
        },
        {
          "name": "tokenAddress",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "pricePerToken",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buy",
      "accounts": [
        {
          "name": "sellerEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dividendVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dividendVaultWallet",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "escrowId",
          "type": "publicKey"
        },
        {
          "name": "tokenAddress",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "sellerEscrowBump",
          "type": "u8"
        },
        {
          "name": "epoch",
          "type": "u64"
        },
        {
          "name": "dividendVaultBump",
          "type": "u8"
        },
        {
          "name": "dividendVaultWalletBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createShareAccount",
      "accounts": [
        {
          "name": "userShareAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimShare",
      "accounts": [
        {
          "name": "userShareAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dividendVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whitelistedNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epoch",
          "type": "u64"
        },
        {
          "name": "userShareAccountBump",
          "type": "u8"
        },
        {
          "name": "dividendVaultBump",
          "type": "u8"
        },
        {
          "name": "whitelistedNftBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimDividend",
      "accounts": [
        {
          "name": "userShareAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dividendVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dividendVaultWallet",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epoch",
          "type": "u64"
        },
        {
          "name": "userShareAccountBump",
          "type": "u8"
        },
        {
          "name": "dividendVaultBump",
          "type": "u8"
        },
        {
          "name": "dividendVaultWalletBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "forceCloseSell",
      "accounts": [
        {
          "name": "sellerEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "escrowId",
          "type": "publicKey"
        },
        {
          "name": "tokenAddress",
          "type": "publicKey"
        },
        {
          "name": "seller",
          "type": "publicKey"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userShareAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "rewardShare",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "dividendVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "lamportDividendAmount",
            "type": "u64"
          },
          {
            "name": "totalShare",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "dividendVaultWallet",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "sellerEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowId",
            "type": "publicKey"
          },
          {
            "name": "seller",
            "type": "publicKey"
          },
          {
            "name": "tokenAddress",
            "type": "publicKey"
          },
          {
            "name": "pricePerToken",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "whitelistedNft",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenAddress",
            "type": "publicKey"
          },
          {
            "name": "lastClaimTs",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Error"
    }
  ]
};

export const IDL: FtTrading = {
  "version": "0.1.0",
  "name": "ft_trading",
  "instructions": [
    {
      "name": "createDividendVault",
      "accounts": [
        {
          "name": "dividendVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dividendVaultWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addWhitelistNft",
      "accounts": [
        {
          "name": "whitelistNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mintAddress",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "resetWhitelistNft",
      "accounts": [
        {
          "name": "whitelistNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "mintAddress",
          "type": "publicKey"
        },
        {
          "name": "whitelistNftBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "sell",
      "accounts": [
        {
          "name": "sellerEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sellerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "escrowId",
          "type": "publicKey"
        },
        {
          "name": "tokenAddress",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "pricePerToken",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buy",
      "accounts": [
        {
          "name": "sellerEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dividendVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dividendVaultWallet",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "escrowId",
          "type": "publicKey"
        },
        {
          "name": "tokenAddress",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "sellerEscrowBump",
          "type": "u8"
        },
        {
          "name": "epoch",
          "type": "u64"
        },
        {
          "name": "dividendVaultBump",
          "type": "u8"
        },
        {
          "name": "dividendVaultWalletBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createShareAccount",
      "accounts": [
        {
          "name": "userShareAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimShare",
      "accounts": [
        {
          "name": "userShareAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dividendVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whitelistedNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epoch",
          "type": "u64"
        },
        {
          "name": "userShareAccountBump",
          "type": "u8"
        },
        {
          "name": "dividendVaultBump",
          "type": "u8"
        },
        {
          "name": "whitelistedNftBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimDividend",
      "accounts": [
        {
          "name": "userShareAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dividendVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dividendVaultWallet",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epoch",
          "type": "u64"
        },
        {
          "name": "userShareAccountBump",
          "type": "u8"
        },
        {
          "name": "dividendVaultBump",
          "type": "u8"
        },
        {
          "name": "dividendVaultWalletBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "forceCloseSell",
      "accounts": [
        {
          "name": "sellerEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "escrowId",
          "type": "publicKey"
        },
        {
          "name": "tokenAddress",
          "type": "publicKey"
        },
        {
          "name": "seller",
          "type": "publicKey"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userShareAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "rewardShare",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "dividendVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "lamportDividendAmount",
            "type": "u64"
          },
          {
            "name": "totalShare",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "dividendVaultWallet",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "sellerEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrowId",
            "type": "publicKey"
          },
          {
            "name": "seller",
            "type": "publicKey"
          },
          {
            "name": "tokenAddress",
            "type": "publicKey"
          },
          {
            "name": "pricePerToken",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "whitelistedNft",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenAddress",
            "type": "publicKey"
          },
          {
            "name": "lastClaimTs",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Error"
    }
  ]
};
