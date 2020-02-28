'use strict';

class Appointment {

    /**
     *
     * @param hospitalId
     * @param patientId
     * @param description
     * @param time
     * @returns {Appointment}
     */
    constructor(hospitalId, patientId, description, time) {
        this.hospitalId = hospitalId;
        this.patientId = patientId;
        this.description = description;
        this.time = time;
        this.type = 'Appointment';
        this.appointmentId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        if (this.__isContract) {
            delete this.__isContract;
        }
        return this;
    }
}

module.exports = Appointment;
