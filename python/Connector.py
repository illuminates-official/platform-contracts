from web3 import Web3, HTTPProvider
from resources.resources import *


class Connector():

    def __init__(self, provider = infura_provider):
        self.w3 = Web3(HTTPProvider(provider))

    def nonce(self, account):
        return self.w3.eth.getTransactionCount(Web3.toChecksumAddress(account))

    def balance(self, account):
        return self.w3.eth.getBalance(Web3.toChecksumAddress(account))

    def chainId(self):
        return int(self.w3.net.version)

    def gasPrice(self):
        return self.w3.eth.gasPrice
