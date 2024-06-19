import { Box, Image, Text } from "@chakra-ui/react"
import { UserTokenType } from "../../utils/web3"
import { shortenHash } from "../../utils"
import { useState } from "react"

interface PropType {
    tokenObj: UserTokenType,
    handleOnClick?: () => void;
}

function TokenCard({
    tokenObj,
    handleOnClick
}: PropType) {

    const [isActive, setActive] = useState<boolean>(false);

    return (
        <Box
            id={tokenObj.tokenAddress}
            border={isActive ? "2px" : "0px"}
            display={"flex"}
            flexDir={"column"}
            onClick={() => { 
                setActive(!isActive);
                if (handleOnClick) {
                    handleOnClick()
                }
             }}
        >
            <Text>{shortenHash(tokenObj.name ? tokenObj.name : "unknown token", 7)}</Text>
            <Image
                src={tokenObj.imageUrl ? tokenObj.imageUrl : "./solana_logo.png"}
            />
        </Box>
    )
}

export default TokenCard