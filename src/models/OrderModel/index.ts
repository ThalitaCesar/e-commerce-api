export class Order {
      constructor(
        private id: string,
        private name: string,
        private folder: string,
        private size: string,
        private price:string,
        private userId: string,
      ) {}
    
      getId() {
        return this.id;
      }
      getName() {
        return this.name;
      }
      getFolder() {
        return this.folder;
      }
      getSize() {
        return this.size;
      }
      getPrice(){
        return this.price;
      }
      getUserId() {
        return this.userId;
      }
    }

    
