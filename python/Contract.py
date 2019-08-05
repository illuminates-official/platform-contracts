import json
from resources.resources import *
from Connector import Connector
from web3 import Web3


class Contract():

    def __init__(self, contract_address, abi_json = 'erc20.json'):
        self.net = Connector()
        with open(abi_json, 'r') as abi:
            self.contract_abi = json.load(abi)
        self.contract = self.net.w3.eth.contract(address = Web3.toChecksumAddress(contract_address), abi = self.contract_abi)

    def function(self, function, *args, sender = senderAddress, chain = 0, gas = 0, gasPrice = 0, nonce = 0, key = pk, call = False):

        func = self.contract.functions[function]

        if call:
            self.output = func(*args).call()
            return self.output
        else:
            sender = Web3.toChecksumAddress(sender)
            if chain is 0: chain = self.net.chainId()
            if gas is 0: gas = func(*args).estimateGas()
            if gasPrice is 0: gasPrice = self.net.gasPrice()
            if nonce is 0: nonce = self.net.nonce(sender)
            txn = func(*args).buildTransaction({
                'chainId': chain,
                'gas': gas,
                'gasPrice': gasPrice,
                'nonce': nonce,
            })
            signed = self.net.w3.eth.account.signTransaction(txn, key)
            txn_hash = self.net.w3.eth.sendRawTransaction(signed.rawTransaction)
            self.txn_receipt = self.net.w3.eth.waitForTransactionReceipt(txn_hash)
            return self.txn_receipt

    def call(self, function, *args, sender = senderAddress):
        
        func = self.contract.functions[function]
        self.output = func(*args).call()
        return self.output