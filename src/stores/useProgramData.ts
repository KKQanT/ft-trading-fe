import { create } from "zustand";
import { DividendVaultType, SellerEscrowAccountInfo, WhitelistedTokenType, userShareAccountType } from "../smart-contract/accounts";

interface UseProgramData {
  allWhiteListedTokenInfo: WhitelistedTokenType[],
  setAllWhiteListedTokenInfo: (dataArr: WhitelistedTokenType[]) => void,
  allDividendVaultInfos: DividendVaultType[],
  setAllDividendVaultInfos: (dataArr: DividendVaultType[]) => void,
  allSellEscrowInfo: SellerEscrowAccountInfo[],
  setAllSellEscrowInfo: (dataArr: SellerEscrowAccountInfo[]) => void,
  userAllShareAccounts: userShareAccountType[],
  setUserAllShareAccounts: (dataArr: userShareAccountType[]) => void,
  userShareAccount: userShareAccountType|null,
  setUserShareAccount: (dataArr: userShareAccountType|null) => void,
}

export const useProgramData = create<UseProgramData>((set) => (
  {
    allWhiteListedTokenInfo: [],
    setAllWhiteListedTokenInfo: (dataArr: WhitelistedTokenType[]) => {
      set({
        allWhiteListedTokenInfo: dataArr
      })
    },
    allDividendVaultInfos: [],
    setAllDividendVaultInfos: (dataArr: DividendVaultType[]) => {
      set({
        allDividendVaultInfos: dataArr
      })
    },
    allSellEscrowInfo: [],
    setAllSellEscrowInfo: (dataArr: SellerEscrowAccountInfo[]) => {
      set({
        allSellEscrowInfo: dataArr
      })
    },
    userAllShareAccounts: [],
    setUserAllShareAccounts: (dataArr: userShareAccountType[]) => {
      set({
        userAllShareAccounts: dataArr
      })
    },
    userShareAccount: null,
    setUserShareAccount: (val: userShareAccountType|null) => {
      set({
        userShareAccount: val
      })
    }
  }
))