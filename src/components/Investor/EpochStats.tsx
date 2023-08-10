import { ReactNode } from 'react';

import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';

import { FiServer } from 'react-icons/fi';
import { GoLocation } from 'react-icons/go';
import { FaClock, FaMoneyBillAlt, FaCoins, FaDollarSign } from "react-icons/fa";
import { useWeb3 } from '../../stores/useWeb3';
import { useProgramData } from '../../stores/useProgramData';
import { userShareAccountType } from '../../smart-contract/accounts';
import { useEffect, useState } from "react"

interface EpochStatsProps {
  userShareAccount: userShareAccountType | null
}

const EpochStats = ({ userShareAccount }: EpochStatsProps) => {

  const { currEpoch } = useWeb3();
  const { allDividendVaultInfos } = useProgramData();
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [userNumShare, setUserNumShare] = useState<number>(0);
  const [totalNumShare, setTotalNumShare] = useState<number>(0);
  const [userIncome, setUserIncome] = useState<number>(0);

  useEffect(() => {
    const currEpochData = allDividendVaultInfos.filter((item) => item.epoch == currEpoch)[0];
    const totalIncome_ = currEpochData.solDividendAmount;
    setTotalIncome(totalIncome_);
    if (userShareAccount) {
      const totalNShare_ = currEpochData.totalNShare;
      const userNShare_ = userShareAccount.nShare;
      const userIncome_ = (totalNShare_ == 0) ? 0 : totalIncome_ * (userNShare_ / totalNShare_)
      setTotalNumShare(totalNShare_);
      setUserNumShare(userNShare_);
      setUserIncome(userIncome_);
    }
  }, [userShareAccount, allDividendVaultInfos])

  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <EpochStatCard title={'Epoch'} stat={currEpoch.toString()} icon={<FaClock size={'3em'} />} />
        <EpochStatCard
          title={'Total Income'}
          stat={`${totalIncome} sol`}
          icon={<FaDollarSign size={'2em'} />}
        />
        <EpochStatCard
          title={'Your Income'}
          stat={`${userIncome} sol (${userNumShare}/${totalNumShare})`}
          icon={<FaDollarSign size={'2em'} />}
          />
      </SimpleGrid>
    </Box>
  )
}

interface EpochStatCardProps {
  title: string,
  stat: string,
  icon: ReactNode
}

const EpochStatCard = (props: EpochStatCardProps) => {
  const { title, stat, icon } = props;
  //to do: stat + test claim

  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'10px'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={"orange.500"}
      rounded={'lg'}>
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}>
          {icon}
        </Box>
      </Flex>
    </Stat>
  )
}

export default EpochStats