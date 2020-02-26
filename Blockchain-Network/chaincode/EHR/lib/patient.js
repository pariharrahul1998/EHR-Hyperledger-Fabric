'use strict';

class Patient {
    /**
     *
     * Patient
     *
     * the patient submits all the details along with the aadhaar card number using which the the profile is created
     * for that patient
     *
     * @param firstName
     * @param lastName
     * @param address
     * @param aadhaar
     * @param DOB
     * @param gender
     * @param bloodGroup
     * @param userName
     * @param password
     * @returns {Patient}
     */
    constructor(firstName, lastName, address, aadhaar, DOB, gender, bloodGroup, userName, password) {
        if (this.validateAadhaar(aadhaar)) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.address = address;
            this.aadhaar = aadhaar;
            this.DOB = DOB;
            this.gender = gender;
            this.bloodGroup = bloodGroup;
            this.userName = userName;
            this.password = password;
            this.type = 'Patient';

            if (this.__isContract) {
                delete this.__isContract;
            }

            return this;
        } else {
            throw new Error(`the aadhaar id ${aadhaar} is not valid`);
        }

    }

    /**
     *
     * @param aadhaar
     * @returns {Promise<boolean>}
     */
    async validateAadhaar(aadhaar) {
        return !!aadhaar;
    }
}

module.exports = Patient;
