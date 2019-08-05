contracts_directory = "../contracts/drafts/"


# infura project ID
projectID = ""
# test net
net = "rinkeby"
# net = "mainnet"


infura_provider = f"https://{net}.infura.io/v3/{projectID}"


# address for sign transaction
senderAddress = ""
# key of signer
pk = ""


chain = {
    "mainnet": 1,
    "ropsten": 3,
    "rinkeby": 4,
    "goerli": 5,
    "kovan": 42,
    "private": 1337
}

chainId = chain[net]
