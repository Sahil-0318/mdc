import crypto from 'crypto'

export const sixDigitRandomNumber = (length = 6) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
}

export const generateBCAReceiptNo = (part, number) => {
    return `BCA/0${part}/${number}`;
}

export const getLastExamYear = (session, part) => {
    const [startYear] = session.split('-').map(Number);
    return startYear + part - 1;
}