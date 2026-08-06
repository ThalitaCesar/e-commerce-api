export class Promotion {
  constructor(
    private id: string,
    private name: string,
    private discountPercent: number,
    private startDate: string,
    private endDate: string,
    private active: boolean,
  ) {}

  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getDiscountPercent() {
    return this.discountPercent;
  }
  getStartDate() {
    return this.startDate;
  }
  getEndDate() {
    return this.endDate;
  }
  getActive() {
    return this.active;
  }
}
