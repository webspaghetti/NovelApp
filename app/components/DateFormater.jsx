function DateFormater({dateString}) { //Passing as string not an object

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export default DateFormater;