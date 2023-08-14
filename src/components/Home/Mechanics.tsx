import {
  Stack,
  Text,
  Container,
  Box,
  Card,
  CardBody,
  Image,
  Heading,
  Link,
  Center,
  ListItem,
  OrderedList
} from "@chakra-ui/react";
import { Fade } from "react-awesome-reveal";

const Mechanics = () => {
  return (
    <Container maxW={"3xl"} bg={''}>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        pb={{ base: 20, md: 36 }}
      >
        <Fade>
          <Stack
            spacing={{ base: 2, md: 4 }}
          >
            <Heading>{"How it actually works "}
              <Text as={'span'} color={'orange.400'}>
                on chain?
              </Text>
            </Heading>
            <Center>
              <Image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA8klEQVR4nO2WOQoCQRAA6xMzuP//yRqtaKKBz1GEDUwW5uhL7Ipt6GJaLUiSJEkSWVbgClTiUYEbcG758AV4AY9gMnXf6bPb1jJQgPs+8AQW/R27dzqNDi6/KBFJpsxKRJApUhKeMkVawkOmaElYyhRtCQsZMwlNGXMJDRk3CUkZVYm1Ixq/+6e3zUZmq2Y0ji40M7NpnUzPzMg5FctobJkxldCScZGQlnGVkPwyW/wYmLyM60tIyoSRmD0z13M6IqPxgIzGKGfm/hIaf5ruElbRaIpWNLogHY2uSEVjCGajMRSj0RiS3mgMTWs0JkmS/BFvaaHoheCxMKAAAAAASUVORK5CYII=" />
            </Center>
          </Stack>
        </Fade>

        <Fade>
          <Stack px={4} spacing={4}>
            <Card
              direction={{
                base: "column",
              }}
              overflow="hidden"
            >
              <Image objectFit="cover" src={"sell_diagram.png"} />
              <CardBody>
                <Heading size="md" mb={"1rem"}>Tokens Listing</Heading>
                <Text textAlign={"start"} py={2}>
                  When listing your tokens for sale, they will be transferred to the token account belonging to the escrow account created by the on-chain program, which will embed details such as the preferred price per token, the amount of tokens, and the owner. The tokens can be moved out of this account on two occasions:
                </Text>
                <OrderedList textAlign={"start"}>
                  <ListItem>You call the program to close the escrow account (only you have the authority to do this) and retrieve tokens along with the amount of Sol you paid to create this account.</ListItem>
                  <ListItem>Someone purchases the token via this on-chain program.</ListItem>
                </OrderedList>
                <Box mt="1rem">
                  <Link color={"orange.500"} href="https://solscan.io/tx/3CTHLMkx2L3hYEV7NTGKDHxRoHwu1osUjUHtDJ4iEFtZSZmJd182b252tvEmYzvpxPABZtzPcJ5htyKVFxzLWUvZ?cluster=devnet" isExternal>
                    view example transaction
                  </Link>
                </Box>
              </CardBody>
            </Card>
          </Stack>
        </Fade>

        <Fade>
          <Stack px={4} spacing={4}>
            <Card
              direction={{
                base: "column",
              }}
              overflow="hidden"
            >
              <Image objectFit="cover" src={"buy_diagram.png"} />
              <CardBody>
                <Heading size="md" mb={"1rem"}> Purchasing Tokens </Heading>
                <Text textAlign={"start"} py={2}>
                  In a single transaction, when purchasing tokens, an amount of Sol equivalent to the token price will be deducted from your wallet and transferred directly to the seller. Concurrently, the seller's escrow will automatically send the requested amount of tokens to your token account. Within this same transaction, the platform will impose a 10% fee, which will be transferred to the platform's dividend storage account. This fee will subsequently be distributed among the platform's shareholders.                </Text>
                <Box mt="1rem">
                  <Link color={"orange.500"} href="https://solscan.io/tx/2vFN545hUFTcK7ihH98dQySvW17a8APLLmB5XUnTfWRhpDHsDev3axWwaZmy5jxBMhUMefAz9MpWDSupcYvDxR5F?cluster=devnet" isExternal>
                    view example transaction
                  </Link>
                </Box>
              </CardBody>
            </Card>
          </Stack>
        </Fade>

        <Fade>
          <Stack px={4} spacing={4}>
            <Card
              direction={{
                base: "column",
              }}
              overflow="hidden"
            >
              <Image objectFit="cover" src={"claim_share.png"} />
              <CardBody>
                <Heading size="md" mb={"2rem"}>  Claim Share </Heading>
                <Text textAlign={"start"} py={2}>
                  If you are a shareholder of our platform (holding our NFTs), you can verify your NFT to claim a percentage share of our income at each time frame (currently set to 1 day), referred to as an "epoch." By verifying your NFTs on-chain, the on-chain program will create an account called "user-share-account" to store shared data, which will later be used to claim dividends in Sol after the end of each epoch.
                </Text> 
                <Text mb={"1rem"} textAlign={"start"}>Note:</Text>
                <OrderedList textAlign={"start"}>
                  <ListItem>During each epoch, when you verify your token, you will be asked for a small amount of Sol. This amount is used to pay Solana for storing data on-chain, and it will be returned to you when you claim your reward after the epoch ends.</ListItem>
                  <ListItem>The on-chain program includes an account called "WhitelistedToken," which stores the recent epoch of the corresponding NFT used for claiming. This mechanism prevents a single NFT from being claimed multiple times within the same epoch.</ListItem>
                </OrderedList>
                <Box mt="1rem">
                  <Link color={"orange.500"} href="https://solscan.io/tx/5Ku4f48jxc1jWNrDPd2MbS3zBW3EyFCy84d3sjTNzqjEfXkFU9oHPn6FnjsLYkui8ib7TTCfBhh3jWfW6d8gGhWq?cluster=devnet" isExternal>
                    view example transaction
                  </Link>
                </Box>
              </CardBody>
            </Card>
          </Stack>
        </Fade>

        <Fade>
          <Stack px={4} spacing={4}>
            <Card
              direction={{
                base: "column",
              }}
              overflow="hidden"
            >
              <Image objectFit="cover" src={"claim_dividend.png"} />
              <CardBody>
                <Heading size="md" mb={"2rem"}>  Claim Dividend </Heading>
                <Text textAlign={"start"} py={2}>
                Each epoch will have a corresponding account to store the "total_n_share," which denotes the total number of platform NFTs used for verification during that epoch. Each shareholder will have their own "UserShareAccount" to store a value called "n_share," which indicates the number of times they have used NFTs for verification in each epoch. For instance, if you hold just one NFT from our company and verify the NFT via our on-chain program during an epoch when there were 20 other NFTs verified by other holders, you would be considered a 5% (1/20) shareholder of the platform for that epoch. Consequently, you can then claim 5% of the platform's income.
                </Text> 
                <Text mb={"1rem"} textAlign={"start"}>Note:</Text>
                <Box mt="1rem">
                  <Link color={"orange.500"} href="https://solscan.io/tx/etJvFSBTVuiaTbh9sxL9P4t4x8UAKZfGSEb3hrnGsxqWnEAHRnGAZp8h8ZzUFLAPRK4jrCnoVNiUqiiKpwLZQzj?cluster=devnet" isExternal>
                    view example transaction
                  </Link>
                </Box>
              </CardBody>
            </Card>
          </Stack>
        </Fade>

      </Stack>
    </Container>
  )
}

export default Mechanics