import { create } from "zustand";
import { DividendVaultType, SellerEscrowAccountInfo, WhitelistedTokenType } from "../smart-contract/accounts";

interface UseProgramData {
  allWhiteListedTokenInfo: WhitelistedTokenType[],
  setAllWhiteListedTokenInfo: (dataArr: WhitelistedTokenType[]) => void,
  allDividendVaultInfos: DividendVaultType[],
  setAllDividendVaultInfos: (dataArr: DividendVaultType[]) => void,
  allSellEscrowInfo: SellerEscrowAccountInfo[],
  setAllSellEscrowInfo: (dataArr: SellerEscrowAccountInfo[]) => void,
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
  }
))