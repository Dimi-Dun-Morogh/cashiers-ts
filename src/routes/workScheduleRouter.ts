import express, { Request, Response } from 'express';
import { WorkScheduleCRUD } from '../db';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await WorkScheduleCRUD.read();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await WorkScheduleCRUD.read({ id });
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      dayOfTheWeek,
      shiftName,
      time,
      cashRegisterId,
      cashierId,
      shopId,
    } = req.body;
    const newItem = await WorkScheduleCRUD.create({
      dayOfTheWeek,
      shiftName,
      time,
      cashRegisterId,
      cashierId,
      shopId,
    });
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const {
      id, dayOfTheWeek,
      shiftName,
      time,
      cashRegisterId,
      cashierId,
      shopId,
    } = req.body;
    const newItem = await WorkScheduleCRUD.update(id, {
      dayOfTheWeek,
      shiftName,
      time,
      cashRegisterId,
      cashierId,
      shopId,
    });
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await WorkScheduleCRUD.delete(id);
    res.status(200).send(true);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
