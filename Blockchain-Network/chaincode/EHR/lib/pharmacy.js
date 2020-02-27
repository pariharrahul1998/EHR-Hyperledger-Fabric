'use strict';

class Pharmacy {

    /**
     *
     * @param userName
     * @param password
     * @param hospitalId
     * @param registrationId
     * @returns {Pharmacy}
     */
    constructor(userName, password, hospitalId, registrationId) {

        if (this.validateRegistrationId(registrationId)) {
            this.userName = userName;
            this.password = password;
            this.hospitalId = hospitalId;
            this.registrationId = registrationId;
            this.type = 'Pharmacy';
            if (this.__isContract) {
                delete this.__isContract;
            }
            return this;
        } else {
            throw new Error(`this registrationid ${registrationId} is not valid`);
        }
    }

    validateRegistrationId(registrationId) {
        return !!registrationId;
    }
}

module.exports = Pharmacy;
