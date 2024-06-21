import { Box, Image, Link, Text } from "@chakra-ui/react"
import { UserTokenType } from "../../utils/web3"
import { shortenHash } from "../../utils"
import { useState } from "react"
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
            border={tokenObj.selected ? "2px" : "0px"}
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
            />
        </Box>
    )
}

export default TokenCard