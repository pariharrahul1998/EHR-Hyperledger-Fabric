'use strict';

class EHR {

    /**
     *
     * @param patientId
     * @param doctorId
     * @param hospitalId
     * @param record
     * @param time
     * @returns {EHR}
     */
    constructor(patientId, doctorId, hospitalId, record, time) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.hospitalId = hospitalId;
        this.record = record;
        this.time = time;
        this.type = 'EHR';
        this.ehrId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        if (this.__isContract) {
            delete this.__isContract;
        }
        return this;
    }
}

module.exports = EHR;
