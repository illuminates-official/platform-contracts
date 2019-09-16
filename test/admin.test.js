const RegistryContract = artifacts.require("./Registry.sol");
const ArticleContract = artifacts.require("./Article.sol");


const DECIMALS = 10 ** 18;
const zeroAddress = "0x0000000000000000000000000000000000000000";
const bytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
const text = "text";


contract('Admin', function (accounts) {

    let deployer = accounts[0];
    let admin = accounts[1];
    let nextAdmin = accounts[2];
    let article = accounts[3];
    let articleAdmin = accounts[4];
    
    let registry;
    let info;

    describe('admin functions', async () => {
        beforeEach('init', async () => {
            registry = await RegistryContract.new(admin, {from: deployer});
            article = await ArticleContract.new(bytes32, text, registry.address);
            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, articleAdmin, {from: admin});
        });

        it('check admin and registry addresses', async () => {
            assert.equal(await article.admin(), articleAdmin);
            assert.equal(await article.registry(), registry.address);
        });

        it('changing admin', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[2], articleAdmin);

            await article.changeAdmin(nextAdmin, {from: articleAdmin});

            assert.equal(await article.admin(), nextAdmin);
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[2], nextAdmin);
        });

        it('changing registry', async () => {
            registry2 = await RegistryContract.new(nextAdmin, {from: deployer});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[2], articleAdmin);

            await article.changeRegistry(registry2.address, {from: articleAdmin});

            // assert.equal(await article.registry(), registry2.address);
            // info = await registry2.getContractInfo.call(article.address);
            // assert.equal(info[1], true);
            // info = await registry.getContractInfo.call(article.address);
            // assert.equal(info[1], false);
        });
    });


    describe('Requirements and restrictions', async () => {
        beforeEach('init', async () => {
            registry = await RegistryContract.new(admin, {from: deployer});
            article = await ArticleContract.new(bytes32, text, registry.address);
            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, articleAdmin, {from: admin});
        });

        it('changing admin (zero address)', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[2], articleAdmin);

            try {
                await article.changeAdmin(zeroAddress, {from: articleAdmin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            assert.equal(await article.admin(), articleAdmin);
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[2], articleAdmin);
        });

        it('changing registry (zero address)', async () => {
            registry2 = await RegistryContract.new(nextAdmin, {from: deployer});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[2], articleAdmin);

            try {
                await article.changeRegistry(zeroAddress, {from: articleAdmin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            assert.equal(await article.registry(), registry.address);
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], true);
        });

        it('changing admin (not by admin)', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[2], articleAdmin);

            try {
                await article.changeAdmin(nextAdmin, {from: admin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            assert.equal(await article.admin(), articleAdmin);
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[2], articleAdmin);
        });

        it('changing registry (not by admin)', async () => {
            registry2 = await RegistryContract.new(nextAdmin, {from: deployer});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[2], articleAdmin);

            try {
                await article.changeRegistry(registry2.address, {from: admin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            assert.equal(await article.registry(), registry.address);
            info = await registry2.getContractInfo.call(article.address);
            assert.equal(info[1], false);
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], true);
        });
    });
});