const RegistryContract = artifacts.require("./Registry.sol");
const ArticleContract = artifacts.require("./Article.sol");


const DECIMALS = 10 ** 18;
const zeroAddress = "0x0000000000000000000000000000000000000000";
const bytes32 =     "0x0000000000000000000000000000000000000000000000000000000000000000";
const text = "text";

function b32(address) {
    return (address + "000000000000000000000000").toLowerCase();
}


contract('Article', function (accounts) {

    let deployer = accounts[0];
    let admin = accounts[1];
    let article = accounts[3];
    let articleAdmin = accounts[4];
    let reference = accounts[5];
    
    let registry;

    describe('article functions', async () => {
        beforeEach('init', async () => {
            registry = await RegistryContract.new(admin, {from: deployer});
            article = await ArticleContract.new(b32(articleAdmin), text, registry.address, {from: deployer});
            await registry.methods["addContractToRegistry(address,uint256,address)"](article.address, 1, articleAdmin, {from: admin});
        });

        it('check information', async () => {
            assert.equal(await article.author(), b32(articleAdmin));
            assert.equal(await article.text(), text);
            assert.equal(await article._reference(), zeroAddress);
        });

        it('adding reference', async () => {
            await article.addReference(reference, {from: articleAdmin});
            assert.equal(await article._reference(), reference);
        });

        it('adding reference (not by admin)', async () => {
            try {
                await article.addReference(reference, {from: deployer});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert.equal(await article._reference(), zeroAddress);
        });

        it('adding reference (same reference)', async () => {
            await article.addReference(reference, {from: articleAdmin});
            try {
                await article.addReference(reference, {from: articleAdmin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert.equal(await article._reference(), reference);
        });
    });
});