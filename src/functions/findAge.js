exports.findAge = (birthday) => {

    const birthDayDate = birthday;
    const birthYear = birthDayDate.getFullYear();
    const birthMonth = birthDayDate.getMonth();
    const birthDate = birthDayDate.getDate();

    const todayFullDate = new Date();
    const todayYear = todayFullDate.getFullYear();
    const todayMonth = todayFullDate.getMonth();
    const todayDate = todayFullDate.getDate();

    if (todayYear > birthYear) {
        age = todayYear - birthYear - 1;
    }

    if (todayMonth > birthMonth) {
        age = age + 1;
    }

    if (todayMonth == birthMonth && todayDate >= birthDate) {
        age = age + 1;
        // console.log(todayDate);
        // console.log(birthDate);
        // console.log(age);
    }

    return age;
}

ageFind = () => {
    
    const dob = new Date("2002/04/01");

    const difference = Date.now() - dob.getTime();

    const ageDate = new Date(difference);

    const finalAge = ageDate.getUTCFullYear - 1970;

}