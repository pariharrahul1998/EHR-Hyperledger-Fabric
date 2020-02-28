'use strict';

class MedicineReceipt {

    /**
     *
     * @param hospitalId
     * @param doctorId
     * @param laboratoryId
     * @param patientId
     * @param time
     * @param record
     * @returns {MedicineReceipt}
     */

    constructor(hospitalId, doctorId, pharmacyId, patientId, time, record) {
        this.hospitalId = hospitalId;
        this.doctorId = doctorId;
        this.pharmacyId = pharmacyId;
        this.patientId = patientId;
        this.time = time;
        this.record = record;
        this.type = 'MedicineReceipt';
        this.medicineReceiptId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return this;
    }
}

module.exports = MedicineReceipt;
