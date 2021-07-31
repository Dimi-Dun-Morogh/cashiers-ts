import express, { Request, Response } from 'express';
import { CashRegCRUD } from '../db';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await CashRegCRUD.read();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await CashRegCRUD.read({ id });
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      shopId, number,
    } = req.body;
    const newItem = await CashRegCRUD.create({
      shopId, number,
    });
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const {
      id, shopId, number,
    } = req.body;
    const newItem = await CashRegCRUD.update(id, {
      shopId, number,
    });
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CashRegCRUD.delete(id);
    res.status(200).send(true);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
