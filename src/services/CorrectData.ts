export class CorrectDate {
    public sendDate = (date: string) => {
      let newDate = date.split("/");
      return `${newDate[2]}-${newDate[1]}-${newDate[0]}`;
    };
  
    public currentDateFormatted = (date: string) => {
      let newDate: Date = new Date(date);
      const newFormattedDate: string =
        newDate.getDate() +
        "/" +
        (newDate.getMonth() + 1) +
        "/" +
        newDate.getFullYear();
      return newFormattedDate;
    };
  }