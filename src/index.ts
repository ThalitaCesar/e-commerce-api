import { adressesRouter } from "./controller/AdressesController";
import { app } from "./controller/app";
import { orderRouter } from "./controller/OrderController";
import { paymentRouter } from "./controller/PaymentController";
import { productRouter } from "./controller/ProductController";
import { promotionRouter } from "./controller/PromotionController";
import { shippingRouter } from "./controller/ShippingController";
import { userRouter } from "./controller/UserController";
import { connectDatabase } from "./database";
import { errorHandler } from "./middlewares/errorMiddleware";

connectDatabase().catch((error) => {
  console.error("Erro ao conectar ao banco de dados:", error);
});

app.use('/user/', userRouter);
app.use('/product/', productRouter);
app.use('/adresses/', adressesRouter);
app.use('/order/', orderRouter);
app.use('/payment/', paymentRouter);
app.use('/promotion/', promotionRouter);
app.use('/shipping/', shippingRouter);
app.use(errorHandler);