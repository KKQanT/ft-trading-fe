import { Box, Image, Link, Text, Center } from "@chakra-ui/react"
import { shortenHash } from "../../utils"
import { AvailableNft } from "./ListTokenModal";

interface PropType {
    tokenObj: AvailableNft,
    handleOnClick?: () => void;
}

function TokenCard({
    tokenObj,
    handleOnClick
}: PropType) {

    return (
        <Box
            id={tokenObj.tokenAddress}
            display={"flex"}
            flexDir={"column"}
        >
            
            <Text>
                <Link
                    href={`https://explorer.solana.com/address/${tokenObj.tokenAddress}?cluster=devnet`}
                    target="_blank"
                >
                    {shortenHash(tokenObj.name ? tokenObj.name : "unknown token", 7)}
                </Link>
            </Text>
            <Image
                cursor={"pointer"}
                src={tokenObj.imageUrl ? tokenObj.imageUrl : "./solana_logo.png"}
                onClick={() => {
                    if (handleOnClick) {
                        handleOnClick()
                    }
                }}
                opacity={tokenObj.selected ? 0.5 : 1}
            />
        </Box>
    )
}

export default TokenCard