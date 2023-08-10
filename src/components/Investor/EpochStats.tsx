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

import { FaClock, FaDollarSign } from "react-icons/fa";
import { useWeb3 } from '../../stores/useWeb3';
import { useProgramData } from '../../stores/useProgramData';
import { useEffect, useState } from "react"
import { roundToFourDigits } from '../../utils';


const EpochStats = () => {

  const { currEpoch } = useWeb3();
  const { allDividendVaultInfos, userShareAccount } = useProgramData();
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [userNumShare, setUserNumShare] = useState<number>(0);
  const [totalNumShare, setTotalNumShare] = useState<number>(0);
  const [userIncome, setUserIncome] = useState<number>(0);

  useEffect(() => {
    const currEpochData = allDividendVaultInfos.filter((item) => item.epoch == currEpoch)[0];
    const totalIncome_ = currEpochData.solDividendAmount;
    const totalNShare_ = currEpochData.totalNShare;
    setTotalIncome(totalIncome_);
    setTotalNumShare(totalNShare_);
    console.log('run useEffect: ', userShareAccount)
    if (userShareAccount) {
      console.log('run useEffect userShareAccount')

      const userNShare_ = userShareAccount.nShare;
      const userIncome_ = (totalNShare_ == 0) ? 0 : totalIncome_ * (userNShare_ / totalNShare_)
      setUserNumShare(userNShare_);
      setUserIncome(userIncome_);
    } else {
      setUserNumShare(0);
      setUserIncome(0);
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
          stat={`${roundToFourDigits(userIncome)} sol (${userNumShare}/${totalNumShare})`}
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