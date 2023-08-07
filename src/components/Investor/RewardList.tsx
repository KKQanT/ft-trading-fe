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
import { useWeb3 } from '../../stores/useWeb3';
import { useEffect, useState } from 'react';
import { DividendVaultType, userShareAccountType } from '../../smart-contract/accounts';
import shortenHash from '../../utils';

interface RewardData extends DividendVaultType {
  rewardShare: number,
  userSolDividendAmount: number,
  userSharePct: number
}

const RewardList = (
  { userAllShareAccounts }:
    { userAllShareAccounts: userShareAccountType[] }
) => {

  const { allDividendVaultInfos } = useProgramData();
  const { currEpoch } = useWeb3()
  const [rewardData, setRewardData] = useState<RewardData[]>([]);
  
  useEffect(() => {
    const prepData = allDividendVaultInfos.filter(
      (item) => item.epoch <= currEpoch
    )
      .map((item) => {
        const epoch = item.epoch;
        const filtered = userAllShareAccounts.filter((item) => item.epoch == epoch);
        let rewardShare = 0;
        if (filtered.length > 0) {
          rewardShare = filtered[0].rewardShare;
        }
        return {
          ...item,
          rewardShare: rewardShare,
          userSolDividendAmount: (
            item.totalShare == 0 ? 0 : rewardShare / item.totalShare * item.solDividendAmount
          ),
          userSharePct: rewardShare == 0 ? 0 : Math.round(rewardShare / item.totalShare * 100)
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
                <Td ><Button>Claim</Button></Td>
              </Tr>)
          })}

        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default RewardList;