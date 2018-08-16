var SHA256 = Package.sha.SHA256;
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
var bcrypt = NpmModuleBcrypt;
var bcryptHash = Meteor.wrapAsync(bcrypt.hash);


const getPasswordString=function(password) {

  return SHA256(password);
};

const hashPassword=function(password) {
  password = getPasswordString(password);
  return bcryptHash(password, Accounts._bcryptRounds);
};

export {hashPassword}
