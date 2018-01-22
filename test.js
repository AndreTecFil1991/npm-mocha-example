var expect = require('chai').expect;
var readFileLines = require('./ReadFileLines');

describe('Example test suite', () => {

    it('expect to process a valid file', (done) => {
        expect(readFileLines('records.txt').toString()).to.be.eql('\n0.51\n');
        done();
    });

    it('expect to process a valid file', (done) => {
        expect(readFileLines('records1.txt').toString()).to.be.eql('\n0.76\n');
        done();
    });

    it('expect to process a valid file', (done) => {
        expect(readFileLines('records2.txt').toString()).to.be.eql('\n0.00\n');
        done();
    });

    it('expect to process an invalid file', (done) => {
        expect(readFileLines('error.txt').toString()).to.be.eql('\nThe give file has some invalid record\n');
        done();
    });

    it('expect to process an invalid file', (done) => {
        expect(readFileLines('').toString()).to.be.eql('\nPlease provide an input file\n');
        done();
    });

    it('expect to process an invalid file', (done) => {
        expect(readFileLines('blablabla.txt').toString()).to.be.eql('\nThe requested file does not exist\n');
        done();
    });

});
