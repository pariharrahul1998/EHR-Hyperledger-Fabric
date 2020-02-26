'use strict';

class Hospital {

    constructor(name, registrationId, userName, password, address) {

        if (this.validateRegistrationId(registrationId)) {
            this.name = name;
            this.userName = userName;
            this.password = password;
            this.address = address;
            this.registrationId = registrationId;
            this.type = 'Hospital';
            if (this.__isContract) {
                delete this.__isContract;
            }
            return this;
        } else {
            throw new Error(`this registrationid ${registrationId} is not valid`);
        }
    }

    /**
     *
     * @param registrationId
     * @returns {boolean}
     */
    validateRegistrationId(registrationId) {
        return !!registrationId;
    }
}

module.exports = Hospital;
