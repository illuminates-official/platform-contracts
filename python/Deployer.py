from resources.resources import *
from web3 import Web3
from solcx import compile_source
from Connector import Connector


class Deployer(Connector):

    def __init__(self, contract_name, contracts_folder = contracts_directory, provider = infura_provider):
        Connector.__init__(self, provider)
        self.contract_file = f"{contracts_folder + contract_name}.sol"

        with open(self.contract_file, 'r') as contract_code:
            self.source_code = contract_code.read()

        self.compiled = compile_source(self.source_code)

        self.abi = self.compiled[f'<stdin>:{contract_name}']['abi']
        self.bin = self.compiled[f'<stdin>:{contract_name}']['bin']

    def deploy(self, *args, deployer, chain = 0, gas = 0, gasPrice = 0, nonce = 0, key = pk):

        contract = self.w3.eth.contract(abi = self.abi, bytecode = self.bin)

        if chain is 0: chain = self.chainId()
        if gas is 0: gas = contract.constructor(*args).estimateGas()
        if gasPrice is 0: gasPrice = self.gasPrice()
        if nonce is 0: nonce = self.nonce(deployer)

        txn = contract.constructor(*args).buildTransaction({
            'chainId': chain,
            'gas': gas,
            'gasPrice': gasPrice,
            'nonce': nonce,
        })

        signed = self.w3.eth.account.signTransaction(txn, key)
        txn_hash = self.w3.eth.sendRawTransaction(signed.rawTransaction)
        self.txn_receipt = self.w3.eth.waitForTransactionReceipt(txn_hash)

        return self.txn_receipt

