import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import NFTList from "./NFTList";

const InvestorSection = () => {

  return (
    <Container maxW={"5xl"} >
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          S3T Trade{' '}
          <Text as={'span'} color={'orange.400'}>
            Investor
          </Text>
        </Heading>

        <Tabs variant='soft-rounded' colorScheme='orange' w={[300, 400, 700]}>
          <TabList>
            <Tab>S3T Trade Stock</Tab>
            <Tab>Dividend</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <NFTList />
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>

        </Tabs>
      </Stack>

    </Container>
  )
}


export default InvestorSection