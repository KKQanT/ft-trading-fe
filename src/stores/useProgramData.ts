import { create } from "zustand";
import { DividendVaultType, WhitelistedTokenType } from "../smart-contract/accounts";

interface UseProgramData {
  allWhiteListedTokenInfo: WhitelistedTokenType[],
  setAllWhiteListedTokenInfo: (dataArr: WhitelistedTokenType[]) => void,
  allDividendVaultInfos: DividendVaultType[],
  setAllDividendVaultInfos: (dataArr: DividendVaultType[]) => void,

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
  }
))