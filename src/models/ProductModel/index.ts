export enum CATEGORIES {
    FEM = "FEM",
    MASC = "MASC", 
    SPORT = "SPORT", 
    BA = "BA", 
    FOOTWEAR = "FOOTWEAR"
  }
  
  export class Product {
      constructor(
        private id: string,
        private name: string,
        private description: string,
        private price:string,
        private created: string,
        private category: CATEGORIES,
        private folder: string,
        private weight: number,
        private height: number,
        private width: number,
        private length: number,
      ) {}

      getId() {
        return this.id;
      }
      getName() {
        return this.name;
      }
      getDescription() {
        return this.description;
      }
      getPrice(){
        return this.price;
      }
      getCreated() {
        return this.created;
      }
      getCategory() {
        return this.category;
      }
      getFolder() {
        return this.folder;
      }
      getWeight() {
        return this.weight;
      }
      getHeight() {
        return this.height;
      }
      getWidth() {
        return this.width;
      }
      getLength() {
        return this.length;
      }
    }

    export class Images {
      constructor(
        private id: string,
        private photos: string,
        private product_id: string,
        private variation_id?: string,
      ) {}

      getId() {
        return this.id;
      }
      getPhotos() {
        return this.photos;
      }
      getProductId() {
        return this.product_id;
      }
      getVariationId() {
        return this.variation_id;
      }
    }

    export class Variation {
      constructor(
        private id: string,
        private name: string,
        private product_id: string,
      ) {}

      getId() {
        return this.id;
      }
      getName() {
        return this.name;
      }
      getProductId() {
        return this.product_id;
      }
    }

    export class VariationSize {
      constructor(
        private id: string,
        private variation_id: string,
        private size: string,
        private price: string,
        private quantity: number,
      ) {}

      getId() {
        return this.id;
      }
      getVariationId() {
        return this.variation_id;
      }
      getSize() {
        return this.size;
      }
      getPrice() {
        return this.price;
      }
      getQuantity() {
        return this.quantity;
      }
    }


