const generateRandomString = function() {
  let result = "";
  let randomText =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomTextLength = randomText.length;
  for (let i = 0; i < 12; i++) {
    result += randomText.charAt(Math.floor(Math.random() * randomTextLength));
  }
  return result;
};

// const adminRandomKey = generateRandomString();
// const guestsRandomKey = generateRandomString();


module.exports = {  generateRandomString }
