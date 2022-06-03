const maskEmail = function (string) {
  var emailAddress,
    emailLen,
    emailValue,
    emailMasked,
    i,
    emailPrint = '';

  emailAddress = string.split('@');

  emailLen = emailAddress[0].length;

  emailValue = emailLen / 2;

  emailMasked = emailLen - emailValue;

  for (i = 0; i < emailValue; i++) {
    emailPrint += emailAddress[0][i];
  }

  for (i = 0; i < emailMasked; i++) {
    emailPrint += '*';
  }
  return emailPrint + '@' + emailAddress[1];
};

export default maskEmail;
