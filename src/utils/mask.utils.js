const emailMasker = (email) => {

    const [name, domain] = email.split('@');
    const { length } = name;

    let maskedMail = '';
    for (let i = 0; i < length; i++) {
        if (i == 0 || i == length - 2) {

            continue;
        } else {

            maskedMail += '*';
        }
    }

    maskedMail = name[0] + maskedMail + name[length - 2] + name[length - 1] + '@' + domain;
    return maskedMail;
}



export default emailMasker