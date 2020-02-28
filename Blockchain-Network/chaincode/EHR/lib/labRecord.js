'use strict';

class LabRecord {

    /**
     *
     * @param hospitalId
     * @param doctorId
     * @param laboratoryId
     * @param patientId
     * @param time
     * @param record
     * @returns {LabRecord}
     */

    constructor(hospitalId, doctorId, laboratoryId, patientId, time, record) {
        this.hospitalId = hospitalId;
        this.doctorId = doctorId;
        this.laboratoryId = laboratoryId;
        this.patientId = patientId;
        this.time = time;
        this.record = record;
        this.type = 'LabRecord';
        this.labRecordId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return this;
    }
}

module.exports = LabRecord;
