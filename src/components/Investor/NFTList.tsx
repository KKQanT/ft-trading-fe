import { SimpleGrid, Button } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Image } from '@chakra-ui/react';


const NFTList = () => {

  return (
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
      <Card>
        <CardHeader>
          <Heading size='md'> XYzt...Sas</Heading>
        </CardHeader>
        <CardBody>
          <Image src={'https://arweave.net/BJW9-TxVQ6kEs6sDkeTcnPyupa1bmLY6zK42jfRJxlo?ext=png'}/>
          <Text>share claimable: 130</Text>
        </CardBody>
        <CardFooter justifyContent={"center"}>
          <Button>View here</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Heading size='md'> XYzt...Sas</Heading>
        </CardHeader>
        <CardBody>
          <Image src={'https://arweave.net/BJW9-TxVQ6kEs6sDkeTcnPyupa1bmLY6zK42jfRJxlo?ext=png'}/>
          <Text>share claimable: 130</Text>
        </CardBody>
        <CardFooter justifyContent={"center"}>
          <Button>View here</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Heading size='md'> XYzt...Sas</Heading>
        </CardHeader>
        <CardBody>
          <Image src={'https://arweave.net/BJW9-TxVQ6kEs6sDkeTcnPyupa1bmLY6zK42jfRJxlo?ext=png'}/>
          <Text>share claimable: 130</Text>
        </CardBody>
        <CardFooter justifyContent={"center"}>
          <Button>View here</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <Heading size='md'> XYzt...Sas</Heading>
        </CardHeader>
        <CardBody>
          <Image src={'https://arweave.net/BJW9-TxVQ6kEs6sDkeTcnPyupa1bmLY6zK42jfRJxlo?ext=png'}/>
          <Text>share claimable: 130</Text>
        </CardBody>
        <CardFooter justifyContent={"center"}>
          <Button>View here</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Heading size='md'> XYzt...Sas</Heading>
        </CardHeader>
        <CardBody>
          <Image src={'https://arweave.net/BJW9-TxVQ6kEs6sDkeTcnPyupa1bmLY6zK42jfRJxlo?ext=png'}/>
          <Text>share claimable: 130</Text>
        </CardBody>
        <CardFooter justifyContent={"center"}>
          <Button>View here</Button>
        </CardFooter>
      </Card>
      
    </SimpleGrid>
  )
}

export default NFTList