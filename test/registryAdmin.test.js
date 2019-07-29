const RegistryContract = artifacts.require("./Registry.sol");


const DECIMALS = 10 ** 18;
const zeroAddress = "0x0000000000000000000000000000000000000000"


contract('RegistryAdmin', function (accounts) {

    let deployer = accounts[0];
    let admin = accounts[1];
    let nextAdmin = accounts[2];
    
    let registry;

    describe('admin functionality', async () => {
        beforeEach('init', async () => {
            registry = await RegistryContract.new(admin, {from: deployer});
        });

        it('check admin', async () => {
            assert.equal(await registry.admin(), admin);
        });

        it('change admin', async () => {
            await registry.changeRegistryAdmin(nextAdmin, {from: admin});
            assert.equal(await registry.admin(), nextAdmin);
        });

        it('try to change admin not by owner', async () => {
            try {
                await registry.changeRegistryAdmin(nextAdmin, {from: deployer});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert.equal(await registry.admin(), admin);
        });
        
        it('try to change admin to zero address', async () => {
            try {
                await registry.changeRegistryAdmin(zeroAddress, {from: admin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert.equal(await registry.admin(), admin);
        });
    });
});