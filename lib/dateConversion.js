module.exports.convertToISODateString = (dateString) => {
  if (dateString) {
    try {
      return new Date(dateString).toISOString();
    } catch (err) {
      console.log(`Provided date can not be converted to ISO standard date`);
      throw err;
    }
  }

  return dateString;
};
