const PrivatePropertyContract = artifacts.require("./PrivateProperty.sol");
const BatchContract = artifacts.require("./Batch.sol");
const RegistryContract = artifacts.require("./Registry.sol");
const ArticleContract = artifacts.require("./Article.sol");
const InvoiceContract = artifacts.require("./Invoice.sol");
const PatentContract = artifacts.require("./Patent.sol");
const TaskContract = artifacts.require("./Task.sol");

const DECIMALS = 10 ** 18;
let text = 'text';
let b32 = '000000000000000000000000';
let za = '0x0000000000000000000000000000000000000000';

function b(address){
    return (address + b32).toLowerCase();
}

console.log('current base functionality testing (01.03.2019)');

contract('Admin (Article)', function (accounts) {

    let owner = accounts[0];
    let admin = accounts[1];
    let newadmin = accounts[2];
    let author = accounts[3];
    let registry = accounts[4];
    let article;

    describe('current base functionality testing', async () => {

        it('admin changing', async () => {
            article = await ArticleContract.new(author, text, admin, registry);            
            assert(await article.cur_admin() == admin);

            await article.changeAdmin(newadmin, {from: admin});
            assert(await article.cur_admin() == newadmin);
        });

        it('changing admin not by current admin', async () => {
            try {
                await article.changeAdmin(admin, {from: admin});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await article.cur_admin() == newadmin);

            try {
                await article.changeAdmin(admin, {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await article.cur_admin() == newadmin);
            
            try {
                await article.changeAdmin(admin, {from: accounts[5]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await article.cur_admin() == newadmin);
        }); 
    });
});


contract('Article', function (accounts) {

        let owner = accounts[0];
        let admin = accounts[1];
        let ref = accounts[2];
        let author = accounts[3];
        let registry = accounts[4];
        let newregistry = accounts[5];

        let article;
    
    describe('current base functionality testing', async () => {
    
        it('init', async () => {
            article = await ArticleContract.new(author, text, admin, registry);            

            assert(await article.author() == (author + b32).toLowerCase());
            assert(await article.text() == text);
            assert(await article.registry() == registry);
        });

        it('adding of reference', async () => {
            assert(await article._reference() == za);

            await article.AddReference(ref, {from: admin});
            assert(await article._reference() == ref);
        });

        it('registry changing', async () => {
            await article.changeRegistry(newregistry, {from: admin});
            assert(await article.registry() == newregistry);
        });

        it('only admin check (reference)', async () => {
            try {
                await article.AddReference(accounts[6], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await article._reference() == ref);

            try {
                await article.AddReference(accounts[6], {from: accounts[6]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await article._reference() == ref);
        });

        it('only admin check (registry)', async () => {
            try {
                await article.changeRegistry(accounts[6], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await article.registry() == newregistry);

            try {
                await article.changeRegistry(accounts[6], {from: accounts[6]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await article.registry() == newregistry);
        });
    });
});


contract('Invoice', function (accounts) {

    let owner = accounts[0];
    let admin = accounts[1];
    let seller = accounts[2];
    let customer = accounts[3];
    let registry = accounts[4];
    let newregistry = accounts[5];
    let delivery = 1000;
    let dochash = accounts[6];

    let invoice;

    describe('current base functionality testing', async () => {

        it('init', async () => {
            invoice = await InvoiceContract.new(seller, customer, delivery, registry, admin);            

            assert(await invoice.seller_hash() == (seller + b32).toLowerCase());
            assert(await invoice.customer_hash() == (customer + b32).toLowerCase());
            assert(await invoice.delivery_time() == delivery);
            assert(await invoice.registry() == registry);
        });

        it('setting document hash', async () => {
            await invoice.setDoc_hash(dochash, {from: admin});
            assert(await invoice.doc_hash() == (dochash + b32).toLowerCase());
        });

        it('registry changing', async () => {
            await invoice.changeRegistry(newregistry, {from: admin});
            assert(await invoice.registry() == newregistry);
        });

        it('setting payment status', async () => {
            await invoice.setPaymentStatus(true, {from: admin});
            assert(await invoice.payment_status() == true);
        });

        it('setting real delivery time', async () => {
            await invoice.setRealDeliveryTime(900, {from: admin});
            assert(await invoice.realDelivery_time() == 900);
            assert(await invoice.delivery_status() == true);
        });

        it('setting delivery status', async () => {
            await invoice.setDeliveryStatus(false, {from: admin});
            assert(await invoice.delivery_status() == false);
        });

        it('only admin check (registry)', async () => {
            try {
                await invoice.changeRegistry(accounts[7], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await invoice.registry() == newregistry);

            try {
                await invoice.changeRegistry(accounts[7], {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await invoice.registry() == newregistry);
        });

        it('setting payment status (onlyAdmin)', async () => {
            try {
                await invoice.setPaymentStatus(false, {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await invoice.payment_status() == true);

            try {
                await invoice.setPaymentStatus(false, {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await invoice.payment_status() == true);
        });

        it('setting real delivery time (onlyAdmin)', async () => {
            try {
                await invoice.setRealDeliveryTime(800, {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await invoice.realDelivery_time() == 900);
            
            try {
                await invoice.setRealDeliveryTime(700, {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await invoice.realDelivery_time() == 900);
        });

        it('setting delivery status (onlyAdmin)', async () => {
            try {
                await invoice.setDeliveryStatus(true, {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await invoice.delivery_status() == false);

            try {
                await invoice.setDeliveryStatus(true, {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await invoice.delivery_status() == false);
        });
    });
});


contract('Patent', function (accounts) {

    let owner = accounts[0];
    let admin = accounts[1];
    let registry = accounts[4];
    let newregistry = accounts[5];
    let doc = accounts[6];

    let patent;

    describe('current base functionality testing', async () => {

        it('init', async () => {
            patent = await PatentContract.new(owner, doc, admin, registry);            

            assert(await patent.owner() == (owner + b32).toLowerCase());
            assert(await patent.doc() == (doc + b32).toLowerCase());
            assert(await patent.cur_admin() == admin);
            assert(await patent.registry() == registry);
        });

        it('registry changing', async () => {
            await patent.changeRegistry(newregistry, {from: admin});
            assert(await patent.registry() == newregistry);
        });

        it('only admin check (registry)', async () => {
            try {
                await patent.changeRegistry(accounts[7], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await patent.registry() == newregistry);

            try {
                await patent.changeRegistry(accounts[7], {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await patent.registry() == newregistry);
        });
    });
});


contract('Private Property', function (accounts) {

    let owner = accounts[0];
    let admin = accounts[1];
    let registry = accounts[4];
    let newregistry = accounts[5];
    let dochash = accounts[6];

    let pp;

    describe('current base functionality testing', async () => {

        it('init', async () => {
            pp = await PrivatePropertyContract.new(admin, owner, registry);            

            assert(await pp.owner_hash() == (owner + b32).toLowerCase());
            assert(await pp.cur_admin() == admin);
            assert(await pp.registry() == registry);
        });

        it('registry changing', async () => {
            await pp.changeRegistry(newregistry, {from: admin});
            assert(await pp.registry() == newregistry);
        });

        it('setting document hash', async () => {
            assert(await pp.doc_hash() == (za + b32).toLowerCase());

            await pp.setDoc_hash(dochash, {from: admin});
            assert(await pp.doc_hash() == (dochash + b32).toLowerCase());
        });

        it('setting document', async () => {
            await pp.setDoc(text, {from: admin});
            assert(await pp.doc() == text);
        });

        it('only admin check (registry)', async () => {
            try {
                await pp.changeRegistry(accounts[7], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await pp.registry() == newregistry);

            try {
                await pp.changeRegistry(accounts[7], {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await pp.registry() == newregistry);
        });

        it('setting doc hash (onlyAdmin)', async () => {
            try {
                await pp.setDoc_hash(accounts[8], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await pp.doc_hash() == (dochash + b32).toLowerCase());

            try {
                await pp.setDoc_hash(accounts[8], {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await pp.doc_hash() == (dochash + b32).toLowerCase());
        });

        it('setting doc (onlyAdmin)', async () => {
            try {
                await pp.setDoc('800', {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await pp.doc() == text);
            
            try {
                await pp.setDoc('700', {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await pp.doc() == text);
        });
    });
});


contract('Batch', function (accounts) {

    let owner = accounts[0];
    let admin = accounts[1];
    let manufacturer = accounts[2];
    let pb = accounts[3];
    let d1 = accounts[4];
    let d2 = accounts[5];
    let distributors = [d1, d2];
    let products = [200, 350];
    let registry = accounts[6];
    let newregistry = accounts[7];

    let batch;

    describe('current base functionality testing', async () => {
        
        let saleP = [100, 150];

        it('init', async () => {
            batch = await BatchContract.new(manufacturer, pb, text, distributors, products, admin, registry);      

            assert(await batch.manufacturer() == b(manufacturer));
            assert(await batch.batch() == b(pb));
            assert(await batch.batchInformation() == text);
            assert(await batch.distributors(0) == b(distributors[0]));
            assert(await batch.distributors(1) == b(distributors[1]));
            assert(await batch.products(b(distributors[0])) == products[0]);
            assert(await batch.products(b(distributors[1])) == products[1]);
            assert(await batch.totalSupply() == 550);
            assert(await batch.cur_admin() == admin);
            assert(await batch.registry() == registry);
        });

        it('registry changing', async () => {
            await batch.changeRegistry(newregistry, {from: admin});
            assert(await batch.registry() == newregistry);
        });

        it('sale', async () => {
            await batch.sale(distributors, saleP, {from: admin});
            assert(await batch.products(b(distributors[0])) == 100);
            assert(await batch.products(b(distributors[1])) == 200);
        });

        it('assigment', async () => {
            await batch.amountAssigment(distributors, products, {from: admin});
            assert(await batch.products(b(distributors[0])) == 300);
            assert(await batch.products(b(distributors[1])) == 550);
        });

        it('only admin check (registry)', async () => {
            try {
                await batch.changeRegistry(accounts[9], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await batch.registry() == newregistry);

            try {
                await batch.changeRegistry(accounts[9], {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await batch.registry() == newregistry);
        });

        it('sale (onlyAdmin)', async () => {
            try {
                await batch.sale(distributors, saleP, {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await batch.products(b(distributors[0])) == 300);
            assert(await batch.products(b(distributors[1])) == 550);

            try {
                await batch.sale(distributors, saleP, {from: accounts[9]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await batch.products(b(distributors[0])) == 300);
            assert(await batch.products(b(distributors[1])) == 550);
        });

        it('assigment (onlyAdmin)', async () => {
            try {
                await batch.amountAssigment(distributors, products, {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await batch.products(b(distributors[0])) == 300);
            assert(await batch.products(b(distributors[1])) == 550);
            
            try {
                await batch.amountAssigment(distributors, products, {from: accounts[9]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await batch.products(b(distributors[0])) == 300);
            assert(await batch.products(b(distributors[1])) == 550);
        });
    });
});


contract('Task', function (accounts) {

    let owner = accounts[0];
    let admin = accounts[1];
    let executor = '0xca35b7d915458ef540ade6068dfe2f44e8fa731c000000000000000000000000';
    let customer = '0xca35b7d915458ef540ade6068dfe2f44e8fa732c000000000000000000000000';
    let tor = '0xca35b7d915458ef540ade6068dfe2f44e8fa733c000000000000000000000000';
    let chat = '0xca35b7d915458ef540ade6068dfe2f44e8fa734c000000000000000000000000';
    let registry = accounts[6];
    let newregistry = accounts[7];

    let task;

    describe('current base functionality testing', async () => {

        it('init', async () => {
            task = await TaskContract.new(executor, customer, tor, chat, admin, registry);

            assert(await task.executor() == executor);
            assert(await task.customer() == customer);
            assert(await task.tor() == tor);
            assert(await task.correspondenceStatus() == chat);            
            assert(await task.cur_admin() == admin);
            assert(await task.registry() == registry);
        });

        it('registry changing', async () => {
            await task.changeRegistry(newregistry, {from: admin});
            assert(await task.registry() == newregistry);
        });

        it('executor changing', async () => {
            await task.changeExecutor(accounts[8], {from: admin});
            assert(await task.executor() == (accounts[8] + b32).toLowerCase());
        });

        it('tor changing', async () => {
            await task.changeTor(accounts[8], {from: admin});
            assert(await task.tor() == (accounts[8] + b32).toLowerCase());
        });

        it('chat status changing', async () => {
            await task.changeCStatus(accounts[8], {from: admin});
            assert(await task.correspondenceStatus() == (accounts[8] + b32).toLowerCase());
        });

        it('only admin check (registry)', async () => {
            try {
                await task.changeRegistry(accounts[7], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await task.registry() == newregistry);

            try {
                await task.changeRegistry(accounts[7], {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await task.registry() == newregistry);
        });

        it('changing executor (onlyAdmin)', async () => {
            try {
                await task.changeExecutor(accounts[9], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await task.executor() == (accounts[8] + b32).toLowerCase());

            try {
                await task.changeExecutor(accounts[9], {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await task.executor() == (accounts[8] + b32).toLowerCase());
        });

        it('tor changing (onlyAdmin)', async () => {
            try {
                await task.changeTor(accounts[9], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await task.executor() == (accounts[8] + b32).toLowerCase());
            
            try {
                await task.changeTor(accounts[9], {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await task.executor() == (accounts[8] + b32).toLowerCase());
        });

        it('chat status (onlyAdmin)', async () => {
            try {
                await task.changeCStatus(accounts[9], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await task.executor() == (accounts[8] + b32).toLowerCase());
            
            try {
                await task.changeCStatus(accounts[9], {from: accounts[7]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await task.executor() == (accounts[8] + b32).toLowerCase());
        });
    });
});


contract('Registry', function (accounts) {

    let owner = accounts[0];
    let admin = accounts[1];

    let registry;
    let task;
    let pp;
    let patent;

    describe('current base functionality testing', async () => {


        let executor = '0xca35b7d915458ef540ade6068dfe2f44e8fa731c000000000000000000000000';
        let customer = '0xca35b7d915458ef540ade6068dfe2f44e8fa732c000000000000000000000000';
        let tor = '0xca35b7d915458ef540ade6068dfe2f44e8fa733c000000000000000000000000';
        let chat = '0xca35b7d915458ef540ade6068dfe2f44e8fa734c000000000000000000000000';
        let doc = accounts[6];

        let info;

        it('init', async () => {
            registry = await RegistryContract.new(admin);
            assert(await registry.cur_admin() == admin);
        });

        it('contracts creating', async () => {
            task = await TaskContract.new(executor, customer, tor, chat, admin, registry.address);
            pp = await PrivatePropertyContract.new(admin, owner, registry.address);
            patent = await PatentContract.new(owner, doc, admin, registry.address);            
        });

        it('adding contract to registry', async () => {
            await registry.addContractToRegistry(0, task.address, {from: admin});
            await registry.addContractToRegistry(2, pp.address, {from: admin});
            await registry.addContractToRegistry(4, patent.address, {from: admin});
        });

        it('adding contract to registry (only admin)', async () => {
            try {
                await registry.addContractToRegistry(1, accounts[7], {from: owner});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await registry.isRegistered(accounts[7]) == false);
            
            try {
                await registry.addContractToRegistry(1, accounts[7], {from: accounts[8]});
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
            assert(await registry.isRegistered(accounts[7]) == false);
        });

        it('registration check', async () => {
            assert(await registry.isRegistered(task.address) == true);
            assert(await registry.isRegistered(pp.address) == true);
            assert(await registry.isRegistered(patent.address) == true);

            assert(await registry.isRegistered(accounts[9]) == false);
        });

        it('get type by number', async () => {
            assert(await registry.getType(0) == 'task');
            assert(await registry.getType(1) == 'news');
            assert(await registry.getType(2) == 'private property');

            try {
                await registry.getType(6);
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
        });
        
        it('get type by address', async () => {
            assert(await registry.getTypeContract(task.address) == 'task');
            assert(await registry.getTypeContract(pp.address) == 'private property');
            assert(await registry.getTypeContract(patent.address) == 'patent');

            try {
                await registry.getTypeContract(accounts[9]);
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
        });
        
        it('checking contract info', async () => {
            info = await registry.getContractInfo(task.address);
            assert(info[0] == 'task');
            assert(info[1] == true);
            assert(info[2] == admin);

            info = await registry.getContractInfo(pp.address);
            assert(info[0] == 'private property');
            assert(info[1] == true);
            assert(info[2] == admin);

            info = await registry.getContractInfo(patent.address);
            assert(info[0] == 'patent');
            assert(info[1] == true);
            assert(info[2] == admin);

            try {
                info = await registry.getContractInfo(accounts[9]);
                console.log("fail.\n Exception must be thrown before");
            } catch (error) {assert(error.message.includes("revert"));}
        });
    });
});