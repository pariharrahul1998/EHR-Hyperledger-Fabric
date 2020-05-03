'use strict';

async function updateDocumentIntoDatabase(userName, documentType, documentId) {
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        let userSchema = {
            userName: userName,
            documentType: documentType,
            documentId: documentId,
            publicId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        };
        client = await mongo.connect(url);
        client.db('EHR').collection(userName).insertOne(userSchema);
        console.log("the public key is successfully stored " + userSchema.publicId);
        await client.close();
        return userSchema.publicId;
    } catch (e) {
        console.log(e);
    }
}

async function removeDocumentFromDatabase(userName, documentType, documentId) {
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        let userSchema = {
            userName: userName,
            documentType: documentType,
            publicId: documentId
        };
        client = await mongo.connect(url);
        await client.db('EHR').collection(userName).deleteOne(userSchema);
        console.log('removed the Document due to unsuccessful generation of EHR');
        await client.close();
    } catch (e) {
        console.log(e);
    }
}

async function verifyFileExistenceAndHash(documentId, hashValue, documentType, collectionName) {
    try {
        const mongoose = require('mongoose');
        let Grid = require('gridfs-stream');
        const mongoURI = `mongodb://127.0.0.1:27017/EHR`;
        const conn = mongoose.createConnection(mongoURI);
        let gfs;

        await conn.once('open', () => {
            // Init stream
            gfs = Grid(conn.db, mongoose.mongo);
            gfs.collection(collectionName);
        });
        let documentSchema = {
            filename: documentId,
            md5: hashValue,
            metadata: {
                documentType: documentType
            }
        };
        console.log(documentSchema);
        let file = await gfs.files.findOne(documentSchema);
        conn.close();
        console.log(file);
        return !(!file || file.length === 0);
    } catch (e) {
        console.log(e);
    }

}

async function getFileDetailsAndDocumentId(userName, publicId, documentType) {
    try {
        const mongo = require('mongodb').MongoClient;
        const url = 'mongodb://127.0.0.1:27017';
        let client;
        let userSchema = {
            userName: userName,
            documentType: documentType,
            publicId: publicId,
        };
        console.log(userSchema);
        client = await mongo.connect(url);
        let result = await client.db('EHR').collection(userName).findOne(userSchema);
        console.log(result);
        let documentId = '';
        if (result && result.userName) {
            documentId = result.documentId;
        }
        await client.close();
        return documentId;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    updateDocumentIntoDatabase,
    removeDocumentFromDatabase,
    verifyFileExistenceAndHash,
    getFileDetailsAndDocumentId
};