import { Connection } from "@solana/web3.js";
import { create } from "zustand";
import * as anchor from '@project-serum/anchor';
import { UserTokenType } from "../utils/web3";

interface UseWeb3 {
  connection: Connection,
  program: anchor.Program<anchor.Idl> | null,
  setProgram: (val: anchor.Program<anchor.Idl>) => void,
  userTokens: UserTokenType[],
  setUserTokens: (dataArr: UserTokenType[]) => void,
  currEpoch: number,
  setCurrEpoch: (val: number) => void,
}

const RPC = import.meta.env.VITE_REACR_APP_RPC

export const useWeb3 = create<UseWeb3>((set) => (
  {
    connection: new Connection(RPC),
    program: null,
    setProgram: (val: anchor.Program<anchor.Idl>) => {
      set({
        program: val
      })
    },
    userTokens: [],
    setUserTokens: (dataArr: UserTokenType[]) => {
      set({
        userTokens: dataArr
      })
    },
    currEpoch: 0,
    setCurrEpoch: (val: number) => {
      set({
        currEpoch: val
      })
    }
  }
))