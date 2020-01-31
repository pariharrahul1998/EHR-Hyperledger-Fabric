/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Contract} = require('fabric-contract-api');

class EhrContract extends Contract {

    async initLedger(ctx) {
        console.log('============= START : Initialize Ledger ===========');
        console.log('============= END : Initialize Ledger ===========');
    }

    async ehrExists(ctx, ehrId) {
        const buffer = await ctx.stub.getState(ehrId);
        return (!!buffer && buffer.length > 0);
    }

    async createEhr(ctx, ehrId, value) {
        const exists = await this.ehrExists(ctx, ehrId);
        if (exists) {
            throw new Error(`The ehr ${ehrId} already exists`);
        }
        const asset = {value};
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ehrId, buffer);
    }

    async readEhr(ctx, ehrId) {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const buffer = await ctx.stub.getState(ehrId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateEhr(ctx, ehrId, newValue) {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const asset = {value: newValue};
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ehrId, buffer);
    }

    async deleteEhr(ctx, ehrId) {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        await ctx.stub.deleteState(ehrId);
    }

}

module.exports = EhrContract;
