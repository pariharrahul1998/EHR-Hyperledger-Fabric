'use strict';

class Researcher {

    /**
     *
     * @param firstName
     * @param lastName
     * @param DOB
     * @param gender
     * @param aadhaar
     * @param userName
     * @param password
     * @returns {Researcher}
     */
    constructor(firstName, lastName, DOB, gender, aadhaar, userName, password) {
        if (this.validateAadhaar(aadhaar)) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.DOB = DOB;
            this.gender = gender;
            this.aadhaar = aadhaar;
            this.userName = userName;
            this.password = password;
            this.type = 'Researcher';
            if (this.__isContract) {
                delete this.__isContract;
            }
            return this;
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

module.exports = Researcher;
