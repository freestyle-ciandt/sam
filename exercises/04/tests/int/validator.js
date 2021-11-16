const removePropertyFromObject = (object, property) => {
    const copy = { ...object };
    delete copy[property];
    return copy;
};

const generateInvalidRequest = (object, property) => {
    const copy = { ...object };

    if (typeof object[property] === 'string') {
        copy[property] = 123;
    }

    copy[property] = 'Invalid Input';
    return copy;
};

module.exports = {
    removePropertyFromObject,
    generateInvalidRequest,
}