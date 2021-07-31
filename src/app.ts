import express from 'express';
import { ApiConfig } from './config';
import cashierRouter from './routes/cashierRoute';
import shopRouter from './routes/shopRouter';
import cashRegRouter from './routes/cashRegRouter';
import workScheduleRouter from './routes/workScheduleRouter';

import { ROUTES } from './models';
import { logger } from './utils';
import { CashierCustomCRUD } from './db';

const app = express();
const { PORT, URL } = ApiConfig;
const NAMESPACE= 'app.ts'

app.use(express.json());

//*FULL CRUD ROUTING

//*   /api/cashiers
app.use(ROUTES.CASHIERS,cashierRouter);

//*   /api/shops
app.use(ROUTES.SHOPS,shopRouter);

//*   /api/cashregs
app.use(ROUTES.CASHREGS, cashRegRouter);

//*   /api/workschedule
app.use(ROUTES.WORKSCHEDULES, workScheduleRouter);


app.listen(PORT, () =>
  logger.info(NAMESPACE, `server up and running on ${URL}:${PORT}`),
);

const {getTargetCashiers1, getTargetCashiers2} = CashierCustomCRUD;

// http://localhost:3011/api/cashiers/targetcashiers1 
getTargetCashiers1().then(res=>logger.info(NAMESPACE,'getTargetCashiers1()',res));
getTargetCashiers2().then(res=>logger.info(NAMESPACE,'getTargetCashiers2()',res));