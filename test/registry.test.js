const RegistryContract = artifacts.require("./Registry.sol");
const ArticleContract = artifacts.require("./Article.sol");


const DECIMALS = 10 ** 18;
const zeroAddress = "0x0000000000000000000000000000000000000000";
const bytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
const text = "text";


contract('Registry', function (accounts) {

    let deployer = accounts[0];
    let admin = accounts[1];
    let nextAdmin = accounts[2];
    let article = accounts[3];
    let invoice = accounts[4];
    
    let registry;
    let info;

    describe('registry functionality', async () => {
        beforeEach('init', async () => {
            registry = await RegistryContract.new(admin, {from: deployer});
            article = await ArticleContract.new(bytes32, text, registry.address);
        });

        it('adding type', async () => {
            await registry.addType("test", {from: admin});
            assert.equal(await registry.types(8), "test");
        });

        it('removing type', async () => {
            assert.equal(await registry.types(5), "Patent");
            await registry.removeType(5, {from: admin});
            assert.equal(await registry.types(5), "Task");
        });

        it('adding contract to registry', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);

            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);
        });

        it('adding contract to registry (without explicit address of an andmin)', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);

            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);
        });

        it('getting information', async () => {
            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});
            await registry.methods["addContractToRegistry(address,uint256,address)"](invoice, 4, deployer, {from: admin});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            info = await registry.getContractInfo.call(invoice);
            assert.equal(info[0], "Invoice");
            assert.equal(info[1], true);
            assert.equal(info[2], deployer);
        });

        it('deactivate contract', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);

            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            await registry.methods["deactivateContract(address)"](article.address, {from: nextAdmin});
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);
        });

        it('admin changing (from registry contract)', async () => {
            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            await registry.methods["changeAdmin(address,address)"](article.address, deployer, {from: nextAdmin});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], deployer);
        });

        it('admin changing (from platform contract)', async () => {
            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            await article.methods["changeAdmin(address)"](deployer, {from: nextAdmin});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], deployer);
        });
    });


    describe('Requirements and restrictions', async () => {
        beforeEach('init', async () => {
            registry = await RegistryContract.new(admin, {from: deployer});
            article = await ArticleContract.new(bytes32, text, registry.address);
        });

        it('adding type (not by owner)', async () => {
            try {
                await registry.addType("test", {from: nextAdmin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
        });

        it('removing type (not by owner)', async () => {
            assert.equal(await registry.types(5), "Patent");
            try {
                await registry.removeType(5, {from: nextAdmin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert.equal(await registry.types(5), "Patent");
        });
        
        it('removing type (index out of range)', async () => {
            assert.equal(await registry.types(5), "Patent");
            try {
                await registry.removeType(8, {from: admin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert.equal(await registry.types(5), "Patent");
        });

        it('adding contract to registry (not by owner)', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);

            try {
                await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: nextAdmin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);
        });

        it('adding contract to registry (out of range)', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);

            try {
                await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 8, nextAdmin, {from: admin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);
        });

        it('adding contract to registry (contract already active)', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);

            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            try {
                await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            try {
                await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, deployer, {from: admin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            try {
                await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 3, nextAdmin, {from: admin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);
        });

        it('deactivate contract (not by owner)', async () => {
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], false);

            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            try {
                await registry.methods["deactivateContract(address)"](article.address, {from: deployer});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[1], true);
        });

        it('admin changing (from registry contract) (not by owner)', async () => {
            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            try {
                await registry.methods["changeAdmin(address,address)"](article.address, deployer, {from: deployer});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);
        });

        it('admin changing (from platform contract)(not by owner)', async () => {
            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});
            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);

            try {
                await article.methods["changeAdmin(address)"](deployer, {from: deployer});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], true);
            assert.equal(info[2], nextAdmin);
        });

        it('admin changing (from platform contract)(from deactivated contract)', async () => {
            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, nextAdmin, {from: admin});
            await registry.methods["deactivateContract(address)"](article.address, {from: nextAdmin});

            try {
                await article.methods["changeAdmin(address)"](deployer, {from: nextAdmin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}

            info = await registry.getContractInfo.call(article.address);
            assert.equal(info[0], "Article");
            assert.equal(info[1], false);
            assert.equal(info[2], nextAdmin);
        });
    });
});