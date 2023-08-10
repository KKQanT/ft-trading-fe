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
import { DividendVaultType, userShareAccountType } from '../../smart-contract/accounts';
import {shortenHash} from '../../utils';

interface RewardData extends DividendVaultType {
  numShare: number,
  userSolDividendAmount: number,
  userSharePct: number
}

const RewardList = (
  { userAllShareAccounts }:
    { userAllShareAccounts: userShareAccountType[] }
) => {

  const { allDividendVaultInfos } = useProgramData();
  const [rewardData, setRewardData] = useState<RewardData[]>([]);

  
  useEffect(() => {

    const claimableEpochs = userAllShareAccounts.map((item) => {return item.epoch});

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
                <Td ><Button >Claim</Button></Td>
              </Tr>)
          })}

        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default RewardList;