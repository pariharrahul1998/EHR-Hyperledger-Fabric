/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Contract} = require('fabric-contract-api');
const path = require('path')
const fs = require('fs');

//import the files which contains the constructors and auxiliary function
let Doctor = require('./doctor.js');
let Patient = require('./patient.js');
let Hospital = require('./hospital.js');
let Appointment = require('./appointment.js');
let EHR = require('./ehr.js');

/**
 * @author : Rahul Parihar
 * @Date : 09/02/2020
 */

class EhrContract extends Contract {

    async initLedger(ctx) {
        console.log('============= START : Initialize Ledger ===========');

        //create a patient


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


        let response = await this.createPatient(ctx, JSON.stringify(patient1));
        console.log(response);

        //create a hospital

        let hospital = {};
        hospital.name = 'name';
        hospital.userName = 'userName';
        hospital.password = 'password';
        hospital.address = 'address';
        hospital.registrationId = 'registrationId';

        response = await this.createHospital(ctx, JSON.stringify(hospital));
        console.log(response);


        //create a doctor

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

        // response = await this.createDoctor(ctx, JSON.stringify(doctor));
        // console.log(response);

        let newDoctor = await new Doctor(doctor.firstName, doctor.lastName, doctor.address, doctor.aadhaar, doctor.medicalRegistrationNo, doctor.DOB, doctor.gender, doctor.userName, doctor.password);
        console.log(newDoctor);

        //create an appointment

        let appointment = {};
        appointment.hospitalId = 'registrationId';
        appointment.patientId = 'pariharrahul2002';
        appointment.description = 'description';
        appointment.time = 'time';

        // response = await this.createAppointment(ctx, JSON.stringify(appointment));
        // console.log(response);


        let newAppointment = await new Appointment(appointment.hospitalId, appointment.patientId, appointment.description, appointment.time);
        console.log(newAppointment);

        /*
                //assign appointment
                let hospitalAsBytes = await ctx.stub.getState(hospital.registrationId);
                hospital = await JSON.parse(hospitalAsBytes);
                let assign = {};
                assign.appointmentId = hospital.appointments[0];
                assign.doctorId = 'medicalRegistrationNo';
                assign.hospitalId = 'registrationId';


                response = await this.assignDoctor(ctx, JSON.stringify(assign));
                console.log(response);

        */
        console.log('============= END : Initialize Ledger ===========');
    }

    /**
     *
     * @param ctx
     * @param ehrId
     * @returns {Promise<boolean|boolean>}
     */
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

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createHospital(ctx, args) {
        args = JSON.parse(args);

        // initialise empty lists of id's of doctors, patients and appointments
        let doctors = [];
        let appointments = [];
        let patients = [];

        //create a new hospital
        let newHospital = await new Hospital(args.name, args.registrationId, args.userName, args.password, args.address);

        newHospital.doctors = doctors;
        newHospital.appointments = appointments;
        newHospital.patients = patients;

        //put the hospital in the global state
        await ctx.stub.putState(newHospital.registrationId, Buffer.from(JSON.stringify(newHospital)));

        let response = `Hospital with registrationId ${newHospital.registrationId} is updated in the world state`;
        return response;
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createDoctor(ctx, args) {
        args = JSON.parse(args);
        let hospitalExists = await this.assestExists(ctx, args.hospitalId);

        if (hospitalExists) {
            //initialise empty patient requests and patients
            let patients = [];
            let appointments = [];


            let newDoctor = await new Doctor(args.firstName, args.lastName, args.address, args.aadhaar, args.medicalRegistrationNo, args.DOB, args.gender, args.userName, args.password);

            //assign the doctor a hospital and update the info in the hospital's global state
            newDoctor.currentHospital = args.hospitalId;


            newDoctor.patients = patients;
            newDoctor.appointments = appointments;

            //put the doctor in the global state
            await ctx.stub.putState(newDoctor.medicalRegistrationNo, Buffer.from(JSON.stringify(newDoctor)));

            let response = `Doctor with medicalRegistrationNo ${newDoctor.medicalRegistrationNo} is updated in the world state`;
            return response;

        } else {
            throw new Error(`There is no such hospital with id ${args.hospitalId} does not exist`);
        }

    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createPatient(ctx, args) {
        args = JSON.parse(args);
        let permissionedIds = [];
        let emergencyContact = [];

        let newPatient = await new Patient(args.firstName, args.lastName, args.address, args.aadhaar, args.DOB, args.gender, args.bloodGroup, args.userName, args.password);

        newPatient.permissionedIds = permissionedIds;
        newPatient.emergencyContact = emergencyContact;

        await ctx.stub.putState(newPatient.userName, Buffer.from(JSON.stringify(newPatient)));

        let response = `Patient with username ${newPatient.userName} is updated in the world state`;
        return response;
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createAppointment(ctx, args) {
        args = JSON.parse(args);

        //check whether both the hospital and the patient already exists or not
        let hospitalExists = await this.assestExists(ctx, args.hospitalId);
        let patientExists = await this.assestExists(ctx, args.patientId);

        if (hospitalExists && patientExists) {
            let newAppointment = await new Appointment(args.hospitalId, args.patientId, args.description, args.time);

            //update the appointment in the world state of the hospital appointments
            let hospitalAsBytes = await ctx.stub.getState(args.hospitalId);
            let hospital = await JSON.parse(hospitalAsBytes);
            let appointments = hospital.appointments;
            appointments.push(newAppointment.appointmentId);

            await ctx.stub.putState(hospital.registrationId, Buffer.from(JSON.stringify(hospital)));

            await ctx.stub.putState(newAppointment, Buffer.from(JSON.stringify(newAppointment)));

            let response = `Appointment with the appointmentId ${newAppointment.appointmentId} is updated in the global state`;
            return response;

        } else {
            throw new Error(`Either the hospital id ${args.hospitalId} or the patient Id ${args.userName}is not correct`)
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async assignDoctor(ctx, args) {
        args = JSON.parse(args);

        //check whether both the doctor and the appointment exists
        let doctorExists = await this.assestExists(ctx, args.doctorId);
        let appointmentExists = await this.assestExists(ctx, args.appointmentId);

        if (doctorExists && appointmentExists) {

            let doctorAsBytes = await ctx.stub.getState(args.doctorId);
            let doctor = await JSON.parse(doctorAsBytes);
            let appointmentAsBytes = await ctx.stub.getState(args.appointmentId);
            let appointment = await JSON.parse(appointmentAsBytes);
            let hospitalAsBytes = await ctx.stub.getState(args.hospitalId);
            let hospital = await JSON.parse(hospitalAsBytes);

            //update the patient and the appointment ids in the doctor's global state
            let appointments = doctor.appointments;
            appointments.push(appointment.appointmentId);
            let patients = doctor.patients;
            patients.push(appointment.patientId);

            ctx.stub.putState(doctor.medicalRegistrationNo, Buffer.from(JSON.stringify(doctor)));

            //update the appointment with the doctor id and update global state
            appointment.doctorId = doctor.medicalRegistrationNo;
            ctx.stub.putState(appointment.appointmentId, Buffer.from(JSON.stringify(appointment)));

            appointments = hospital.appointments;

            //remove that appointment from the appointment list of the hospital and update it in the global state of hospital
            let index = appointments.indexOf(appointment.appointmentId);
            if (index > -1) {
                appointments.splice(index, 1);
            }
            ctx.stub.putState(hospital.registrationId, Buffer.from(JSON.stringify(hospital)));

            let response = `Appointment with the appointmentId ${appointment.appointmentId} is assigned a doctor with id ${doctor.medicalRegistrationNo}`;
            return response;

        } else {
            throw new Error(`Doctor or appointment with ids ${args.doctorId} or ${args.appointmentId} doesn't exist`);
        }
    }

    /**
     *
     * @param ctx
     * @param id
     * @returns {Promise<boolean|boolean>}
     */
    async assestExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

}

module.exports = EhrContract;
