import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from '@chakra-ui/react'
import { useProgramData } from '../../stores/useProgramData';
import { useEffect, useState } from 'react';
import { DividendVaultType, getAllDividendVaults, getUserAllShareAccountInfo } from '../../smart-contract/accounts';
import { shortenHash } from '../../utils';
import { useWeb3 } from '../../stores/useWeb3';
import { createClaimDividendIntruction } from '../../smart-contract/intructions';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { useLoading } from '../../stores/useLoading';

interface RewardData extends DividendVaultType {
  numShare: number,
  userSolDividendAmount: number,
  userSharePct: number
}

const RewardList = () => {

  const {
    allDividendVaultInfos,
    userAllShareAccounts,
    setAllDividendVaultInfos,
    setUserAllShareAccounts
  } = useProgramData();
  const [rewardData, setRewardData] = useState<RewardData[]>([]);
  const { currEpoch, program, connection } = useWeb3();
  const wallet = useAnchorWallet();
  const { setLoading } = useLoading();

  const reloadData = async () => {

    setLoading(true);

    const dataArrDV = await getAllDividendVaults(connection);
    setAllDividendVaultInfos(dataArrDV);

    const accounts = await getUserAllShareAccountInfo(connection, wallet!.publicKey);
    setUserAllShareAccounts(accounts);

    setLoading(false);

  }

  const claimDividend = async (epoch: number) => {
    if (wallet?.publicKey && program) {
      const transaction = new Transaction();
      const claimIx = await createClaimDividendIntruction(
        program,
        wallet?.publicKey,
        epoch
      );
      transaction.add(claimIx);
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

      const signedTx = await wallet.signTransaction(transaction);
      const wireTx = signedTx.serialize();
      const signature = await connection.sendRawTransaction(wireTx);
      await connection.confirmTransaction(signature, "finalized");
      reloadData();
    }
  }

  useEffect(() => {

    const claimableEpochs = userAllShareAccounts.map((item) => { return item.epoch });

    const prepData = allDividendVaultInfos.filter(
      (item) => claimableEpochs.includes(item.epoch)
    )
      .map((item) => {
        const epoch = item.epoch;
        const filtered = userAllShareAccounts.filter((item) => item.epoch == epoch);
        let numShare = 0;
        if (filtered.length > 0) {
          numShare = filtered[0].nShare;
        }
        return {
          ...item,
          numShare: numShare,
          userSolDividendAmount: (
            item.totalNShare == 0 ? 0 : numShare / item.totalNShare * item.solDividendAmount
          ),
          userSharePct: numShare == 0 ? 0 : Math.round(numShare / item.totalNShare * 100)
        };
      })
      .sort((a, b) => b.epoch - a.epoch);
    setRewardData(prepData);
    console.log("prepData: ", prepData)
  }, [allDividendVaultInfos, userAllShareAccounts])

  return (
    <TableContainer>
      <Table variant={"striped"} colorScheme={"orange"}>
        <Thead>
          <Tr>
            <Th isNumeric>Epoch</Th>
            <Th>address</Th>
            <Th>Total Dividend</Th>
            <Th>Your share</Th>
            <Th> </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rewardData.map((item) => {
            return (
              <Tr>
                <Td>{item.epoch}</Td>
                <Td>{shortenHash(item.address)}</Td>
                <Td>{item.solDividendAmount} {'SOL'}</Td>
                <Td>{item.userSolDividendAmount} {"SOL"} {`(${(item.userSharePct)}%)`}</Td>
                <Td >
                  <Button
                    isDisabled={item.epoch == currEpoch}
                    onClick={() => claimDividend(item.epoch)}
                  >Claim
                  </Button>
                </Td>
              </Tr>)
          })}

        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default RewardList;