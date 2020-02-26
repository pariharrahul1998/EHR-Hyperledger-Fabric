/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {ChaincodeStub, ClientIdentity} = require('fabric-shim');
const {EhrContract} = require('..');
let Doctor = require('../lib/doctor.js');
let Patient = require('../lib/patient.js');
let Hospital = require('../lib/hospital.js');
let Appointment = require('../lib/appointment.js');
let EHR = require('../lib/ehr.js');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('EhrContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {

        let doctor = {};
        doctor.firstName = 'firstName';
        doctor.lastName = 'lastName';
        doctor.address = 'address';
        doctor.aadhaar = 'aadhaar';
        doctor.medicalRegistrationNo = 'medicalRegistrationNo';
        doctor.DOB = 'DOB';
        doctor.gender = 'gender';
        doctor.userName = 'userName';
        doctor.password = 'password';
        doctor.type = 'Doctor';
        doctor.hospitalId = 'registrationId';
        doctor.patients = [];
        doctor.appointments = [];

        let patient1 = {};
        patient1.firstName = 'first1';
        patient1.lastName = 'last1';
        patient1.address = 'address1';
        patient1.aadhaar = '1234';
        patient1.DOB = '20/02/1998';
        patient1.gender = 'Male';
        patient1.bloodGroup = 'AB+';
        patient1.userName = 'pariharrahul2002';
        patient1.password = '12345';

        let hospital = {};
        hospital.name = 'name';
        hospital.userName = 'userName';
        hospital.password = 'password';
        hospital.address = 'address';
        hospital.registrationId = 'registrationId';
        hospital.appointments = ['appointmentId'];

        let appointment = {};
        appointment.hospitalId = 'registrationId';
        appointment.patientId = 'pariharrahul2002';
        appointment.description = 'description';
        appointment.time = 'time';
        appointment.appointmentId = 'appointmentId';


        contract = new EhrContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"ehr 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"ehr 1002 value"}'));
        ctx.stub.getState.withArgs('registrationId').resolves(Buffer.from(JSON.stringify(hospital)));
        ctx.stub.getState.withArgs('pariharrahul2002').resolves(Buffer.from(JSON.stringify(patient1)));
        ctx.stub.getState.withArgs('medicalRegistrationNo').resolves(Buffer.from(JSON.stringify(doctor)));
        ctx.stub.getState.withArgs('appointmentId').resolves(Buffer.from(JSON.stringify(appointment)));
    });

    describe('#ehrExists', () => {

        it('should return true for a ehr', async () => {
            await contract.ehrExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a ehr that does not exist', async () => {
            await contract.ehrExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createEhr', () => {

        it('should create a ehr', async () => {
            await contract.createEhr(ctx, '1003', 'ehr 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"ehr 1003 value"}'));
        });

        it('should throw an error for a ehr that already exists', async () => {
            await contract.createEhr(ctx, '1001', 'myvalue').should.be.rejectedWith(/The ehr 1001 already exists/);
        });

    });

    describe('#readEhr', () => {

        it('should return a ehr', async () => {
            await contract.readEhr(ctx, '1001').should.eventually.deep.equal({value: 'ehr 1001 value'});
        });

        it('should throw an error for a ehr that does not exist', async () => {
            await contract.readEhr(ctx, '1003').should.be.rejectedWith(/The ehr 1003 does not exist/);
        });

    });

    describe('#updateEhr', () => {

        it('should update a ehr', async () => {
            await contract.updateEhr(ctx, '1001', 'ehr 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"ehr 1001 new value"}'));
        });

        it('should throw an error for a ehr that does not exist', async () => {
            await contract.updateEhr(ctx, '1003', 'ehr 1003 new value').should.be.rejectedWith(/The ehr 1003 does not exist/);
        });

    });

    describe('#deleteEhr', () => {

        it('should delete a ehr', async () => {
            await contract.deleteEhr(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a ehr that does not exist', async () => {
            await contract.deleteEhr(ctx, '1003').should.be.rejectedWith(/The ehr 1003 does not exist/);
        });

    });

    describe('#initLedger', async () => {
        it('should update the result in the global state', async () => {
            let result = await contract.initLedger(ctx);

        });
    });

});
