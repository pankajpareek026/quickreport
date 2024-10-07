import { isAddress } from "web3-validator"

const isWalletAddress = (address) => {


    const is = isAddress(address);
    return {
        is,
        address
    }
}

export { isWalletAddress }