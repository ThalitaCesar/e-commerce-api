export class Order {
      constructor(
        private id: string,
        private productId: string,
        private userId: string,
        private quantity: number,
        private variationSizeId?: string,
      ) {}

      getId() {
        return this.id;
      }
      getProductId() {
        return this.productId;
      }
      getUserId() {
        return this.userId;
      }
      getQuantity() {
        return this.quantity;
      }
      getVariationSizeId() {
        return this.variationSizeId;
      }
    }


