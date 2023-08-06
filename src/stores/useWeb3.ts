import { Connection } from "@solana/web3.js";
import { create } from "zustand";
import * as anchor from '@project-serum/anchor';

interface UseWeb3 {
  connection: Connection,
  program: anchor.Program<anchor.Idl> | null,
  setProgram: (val: anchor.Program<anchor.Idl>) => void
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
    }
  }
))