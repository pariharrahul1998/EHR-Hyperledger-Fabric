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
let Insurance = require('./insurance.js');
let Laboratory = require('./laboratory.js');
let Researcher = require('./researcher.js');
let Bill = require('./bill.js');

/**
 * @author : Rahul Parihar
 * @Date : 09/02/2020
 */

class EhrContract extends Contract {

    /**
     *
     * @param ctx
     * @returns {Promise<void>}
     */
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

    async ehrExists(ctx, ehrId) {
        const buffer = await ctx.stub.getState(ehrId);
        return (!!buffer && buffer.length > 0);
    }

    /**
     *
     * @param ctx
     * @param args - hospital id , appointment id , doctor id , patient id
     * @param record - will be in the form of hash of the the original record either in the form of pdf of any digital copy
     * @returns {Promise<string>}
     */
    async createEhr(ctx, args, record) {
        args = JSON.parse(args);
        let hospitalExists = await this.assestExists(ctx, args.hospitalId);
        let patientExists = await this.assestExists(ctx, args.patientId);
        let doctorExists = await this.assestExists(ctx, args.doctorId);
        let appointmentExists = await this.assestExists(ctx, args.appointmentId);

        if (hospitalExists && doctorExists && patientExists && appointmentExists) {

            //create a new EHR and update it in the world state
            let newEHR = await new EHR(args.patientId, args.doctorId, args.hospitalId, record, args.time);
            await ctx.stub.putState(newEHR.ehrId, Buffer.from(JSON.stringify(newEHR)));

            //update the EHR in the list of the ehrs for the patient
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let ehrs = patient.ehrs;
            ehrs.push(newEHR.ehrId);
            patient.ehrs = ehrs;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            let response = `an EHR is created with id${newEHR.ehrId} and stored in the world state`;
            return response;

        } else {
            throw new Error(`Either the hospital, patient, doctor or the appointment id is wrong`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async requestAccess(ctx, args) {
        args = JSON.parse(args);
        let requesterExists = await this.assestExists(ctx, args.requesterId);
        let patientExists = await this.assestExists(ctx, args.patientId);
        if (requesterExists && patientExists) {

            //get the patient and update the request for that patient
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let requesters = patient.requesters;
            requesters.push(args.requesterId);

            ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

            let response = `the request to access the documents has been submitted with the patient`;
            return response;
        } else {
            throw new Error(`this requester with id ${args.requesterId} or the patient with id ${args.patientId} doesn't exist`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async grantAccess(ctx, args) {
        args = JSON.parse(args);
        let patientExists = await this.assestExists(ctx, args.patientId);
        if (patientExists) {
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let permissionedIds = patient.permissionedIds;
            let requesters = patient.requesters;
            let index = requesters.indexOf(args.requesterId);
            if (index > -1) {
                requesters.splice(index, 1);
                patient.requesters = requesters;
                permissionedIds[args.requesterId] = args.documentIds;
                patient.permissionedIds = permissionedIds;
                await ctx.stub.putstate(patient.userName, Buffer.from(JSON.stringify(patient)));

                //update the patient in the patient array for the requester
                let requesterAsBytes = await ctx.stub.getState(args.requesterId);
                let requester = JSON.parse(requesterAsBytes);
                let patients = requester.patients;
                patients.push(args.patientId);
                await ctx.stub.putState(args.requesterId, Buffer.from(JSON.stringify(requester)));

                let response = `Access has been provided to the requester with the id ${args.requesterId}`;
                return response;
            } else {
                throw new Error(`No such requester with id ${args.requesterId}`);
            }
        } else {
            throw new Error(`patient with id ${args.patientId} doesn't exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async revokeAccess(ctx, args) {
        args = JSON.parse(args);
        let patientExists = await this.assestExists(ctx, args.patientId);
        if (patientExists) {
            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let permissionedIds = patient.permissionedIds;
            if (permissionedIds.has(args.permissionedId)) {
                permissionedIds.delete(args.permissionedId);
                patient.permissionedIds = permissionedIds;
                await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));

                //update the patient in the patient array for the requester
                let requesterAsBytes = await ctx.stub.getState(args.permissionedId);
                let requester = JSON.parse(requesterAsBytes);
                let patients = requester.patients;
                let index = patients.indexOf(args.patientId);
                if (index > -1) {
                    patients.splice(index, 1);
                    requester.patients = patients;
                    await ctx.stub.putState(args.permissionedId, Buffer.from(JSON.stringify(requester)));
                }

                let response = `Access has been revoked for the requester with the id ${args.permissionedId}`;
                return response;
            } else {
                throw new Error(`No such Permissioned id with id ${args.requesterId}`);
            }
        } else {
            throw new Error(`patient with id ${args.patientId} doesn't exists`);
        }
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
    async generateBill(ctx, args) {
        args = JSON.parse(args);
        let hospitalExists = await this.assestExists(args.hospitalId);
        let patientExists = await this.assestExists(args, patientId);
        let doctorExists = await this.assestExists(args.doctorId);
        let laboratoryExists = await this.assestExists(args.laboratoryId);
        let pharmacyExists = await this.assestExists(args.pharmacyId);

        if (hospitalExists && patientExists && doctorExists && laboratoryExists && pharmacyExists) {

            let newBill = await new Bill(args.hospitalId, args.patientId, args.doctorId, args.laboratoryId, args.pharmacyId, args.time);
            await ctx.stub.putState(newBill.billId, Buffer.from(JSON.stringify(newBill)));

            let patientAsBytes = await ctx.stub.getState(args.patientId);
            let patient = JSON.parse(patientAsBytes);
            let bills = patient.bills;
            bills.push(newBill.billId);
            patient.bills = bills;
            await ctx.stub.putState(patient.userName, Buffer.from(JSON.stringify(patient)));
            let response = `Bill has been generated with id ${newBill.billId}`;
            return response;

        } else {
            throw new Error(`Either the patient or hospital entity is not correct`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createInsurance(ctx, args) {
        args = JSON.parse(args);
        let patients = [];

        //create a new insurer and update that in the world state
        let newInsurer = await new Insurance(args.name, args.userName, args.password, args.address, args.registrationId);
        newInsurer.patients = patients;

        await ctx.stub.putState(newInsurer.registrationId, Buffer.from(JSON.stringify(newInsurer)));

        let response = `a new insurer created with id ${newInsurer.registrationId} `;
        return response;
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createLaboratory(ctx, args) {
        args = JSON.parse(args);
        let hospitalExists = await this.assestExists(args.hospitalId);
        if (hospitalExists) {
            let patients = [];
            let newLaboratory = await new Laboratory(args.userName, args.password, args.hospitalId, args.registrationId);
            newLaboratory.patients = patients;

            await ctx.stub.putState(newLaboratory.registrationId, Buffer.from(JSON.stringify(newLaboratory)));

            let response = `the laboratory with id ${newLaboratory.registrationId} has been updated in the world state`;
            return response;
        } else {
            throw new Error(`No such hospital exists`);
        }
    }

    async createResearcher(ctx, args) {
        args = JSON.parse(args);
        let patients = [];

        //create a new Researcher and update that in the world state
        let newResearcher = await new Researcher(args.name, args.userName, args.password, args.address, args.registrationId);
        newResearcher.patients = patients;

        await ctx.stub.putState(newInsurer.registrationId, Buffer.from(JSON.stringify(newInsurer)));

        let response = `a new researcher created with id ${newResearcher.userName} `;
        return response;
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createPharmacy(ctx, args) {
        args = JSON.parse(args);
        let hospitalExists = await this.assestExists(args.hospitalId);
        if (hospitalExists) {
            let patients = [];
            let newPharmacy = await new Pharmacy(args.userName, args.password, args.hospitalId, args.registrationId);
            newPharmacy.patients = patients;

            await ctx.stub.putState(newPharmacy.registrationId, Buffer.from(JSON.stringify(newPharmacy)));

            let response = `the pharmacy with id ${newLaboratory.registrationId} has been updated in the world state`;
            return response;
        } else {
            throw new Error(`No such hospital exists`);
        }
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
        let permissionedIds = {};
        let emergencyContact = [];
        let ehrs = [];
        let requesters = [];
        let bills = [];

        let newPatient = await new Patient(args.firstName, args.lastName, args.address, args.aadhaar, args.DOB, args.gender, args.bloodGroup, args.userName, args.password);

        newPatient.permissionedIds = permissionedIds;
        newPatient.emergencyContact = emergencyContact;
        newPatient.ehrs = ehrs;
        newPatient.requesters = requesters;

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
