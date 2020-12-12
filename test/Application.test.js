const Application = artifacts.require('Application');
const truffleAssert = require('truffle-assertions');
// import web3 from 'web3';
// import {assert, expect} from 'chai';

contract('Application', (accounts) => {

    describe('deployment', () => {
        let application;

        before(async () => {
            application = await Application.deployed();
        });

        it('should deploy successfully', async () => {
            const address = await application.address;
            assert.isOk(address);
        });

    });

    describe('fundraisers', () => {
        let application;
        const accountOne = accounts[0];
        const accountTwo = accounts[1];
        const fundingAccount = accounts[2];

        beforeEach(async () => {
            application = await Application.new({ from: fundingAccount });
        });

        it('should create a fundraiser', async () => {
            await application.createFundraiser('Title', web3.utils.toWei('1', 'Ether'), {from: accountOne});
            const fundraiser = await application.fundraisers(0);

            assert.equal(fundraiser.owner, accountOne);
            assert.equal(fundraiser.goal, web3.utils.toWei('1', 'Ether'));
            assert.equal(fundraiser.title, 'Title');
            assert.equal(fundraiser.id, 0);
            assert.equal(fundraiser.raised, 0);
        });

        it('should return all fundraisers', async () => {
            await application.createFundraiser('Title 1', web3.utils.toWei('1', 'Ether'), {from: accountOne});
            await application.createFundraiser('Title 2', web3.utils.toWei('2', 'Ether'), {from: accountTwo});

            const fundraisers = await application.getAllFundraisers();
            
            assert.equal(fundraisers[0].length, 2);
            assert.equal(fundraisers[0][0], 0);
            assert.equal(fundraisers[0][1], 1);
        });

        it('should allow sending funds', async () => {
            await application.createFundraiser('Title', web3.utils.toWei('1', 'Ether'), {from: accountOne});

            const fundsBefore = web3.utils.fromWei(await web3.eth.getBalance(accountTwo));
            await application.supportFundraiser(0, {from: accountTwo, value: web3.utils.toWei('1', 'Ether')});
            const fundsAfter = web3.utils.fromWei(await web3.eth.getBalance(accountTwo));

            assert.isTrue(fundsBefore - fundsAfter >= 1);
            
            const accountValue = web3.utils.fromWei(await web3.eth.getBalance(application.address));
            assert.equal(accountValue, 1);
        });

        it('should refund', async () => {
            await application.createFundraiser('Title', web3.utils.toWei('1', 'Ether'), {from: accountOne});

            const fundsBefore = web3.utils.fromWei(await web3.eth.getBalance(accountTwo));
            await application.supportFundraiser(0, {from: accountTwo, value: web3.utils.toWei('1', 'Ether')});
            await application.refundFundraiser(0, {from: accountTwo});
            const fundsAfter = web3.utils.fromWei(await web3.eth.getBalance(accountTwo));

            assert.isTrue(fundsBefore - fundsAfter < 0.1);
            assert.isTrue(fundsBefore - fundsAfter >= 0);
            
            const accountValue = web3.utils.fromWei(await web3.eth.getBalance(application.address));
            assert.equal(accountValue, 0);
        });

        it('should complete the fundraiser', async () => {
            await application.createFundraiser('Title', web3.utils.toWei('1', 'Ether'), {from: accountOne});
            const fundsBefore = web3.utils.fromWei(await web3.eth.getBalance(accountOne));

            await application.supportFundraiser(0, {from: accountTwo, value: web3.utils.toWei('1', 'Ether')});
            await application.completeTheFundraiser(0, {from: accountOne});

            const fundsAfter = web3.utils.fromWei(await web3.eth.getBalance(accountOne));
            
            assert.isTrue(fundsAfter - fundsBefore > 0);
            assert.isTrue(fundsAfter - fundsBefore <= 1);
            
            const accountValue = web3.utils.fromWei(await web3.eth.getBalance(application.address));
            assert.equal(accountValue, 0);
        });

        it('should refund all backers', async () => {
            await application.createFundraiser('Title', web3.utils.toWei('2', 'Ether'), {from: fundingAccount});

            const fundsBefore1 = web3.utils.fromWei(await web3.eth.getBalance(accountOne));
            const fundsBefore2 = web3.utils.fromWei(await web3.eth.getBalance(accountTwo));

            await application.supportFundraiser(0, {from: accountOne, value: web3.utils.toWei('1', 'Ether')});
            await application.supportFundraiser(0, {from: accountTwo, value: web3.utils.toWei('1', 'Ether')});

            await application.cancelTheFundraiser(0, {from: fundingAccount});

            const fundsAfter1 = web3.utils.fromWei(await web3.eth.getBalance(accountOne));
            const fundsAfter2 = web3.utils.fromWei(await web3.eth.getBalance(accountTwo));

            assert.isTrue(fundsBefore2 - fundsAfter2 < 0.1);
            assert.isTrue(fundsBefore2 - fundsAfter2 >= 0);
            assert.isTrue(fundsBefore1 - fundsAfter1 < 0.1);
            assert.isTrue(fundsBefore1 - fundsAfter1 >= 0);
            
            const accountValue = web3.utils.fromWei(await web3.eth.getBalance(application.address));
            assert.equal(accountValue, 0);
        });

    });
});