module.exports.convertToISODateString = (dateString) => {
  if (dateString) {
    try {
      return new Date(dateString).toISOString();
    } catch (err) {
      console.log(`indexed-date can not be converted to ISO standard date`);
      throw err;
    }
  }

  return dateString;
};
