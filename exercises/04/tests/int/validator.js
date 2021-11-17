const removePropertyFromObject = (object, property) => {
    const copy = { ...object };
    delete copy[property];
    return copy;
};

const generateEmptyField = (object, property) => {
    const copy = { ...object };
    copy[property] = typeof copy[property] === 'string' ? '' : 0;
    return copy;
}

const generateInvalidRequest = (object, property) => {
    const copy = { ...object };
    copy[property] = typeof copy[property] === 'string' ? 123 : 'Invalid Input';
    return copy;
};

module.exports = {
    removePropertyFromObject,
    generateInvalidRequest,
    generateEmptyField,
}