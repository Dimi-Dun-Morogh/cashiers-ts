import express, { Request, Response } from 'express';
import { CashierCRUD, CashierCustomCRUD } from '../db';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await CashierCRUD.read();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/targetcashiers1', async (req: Request, res: Response) => {
  try {
    const target = await CashierCustomCRUD.getTargetCashiers1();
    res.status(200).send(target);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/targetcashiers2', async (req: Request, res: Response) => {
  try {
    const target = await CashierCustomCRUD.getTargetCashiers2();
    res.status(200).send(target);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await CashierCRUD.read({ id });
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name, age, sex, yearsOfExperience, worksInShifts, pastWorks,
    } = req.body;
    const newItem = await CashierCRUD.create({
      name,
      age,
      sex,
      yearsOfExperience,
      worksInShifts,
      pastWorks,
    });
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/hire', async (req: Request, res: Response) => {
  try {
    const {
      cashierId, shopId,
    } = req.body;
    const newItem = await CashierCRUD.hireCashier(
      cashierId, shopId,
    );
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/fire', async (req: Request, res: Response) => {
  try {
    const {
      cashierId, shopId,
    } = req.body;
    const newItem = await CashierCRUD.fireCashier(
      cashierId, shopId,
    );
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const {
      id, name, age, sex, yearsOfExperience, worksInShifts, pastWorks,
    } = req.body;
    const newItem = await CashierCRUD.update(id, {
      name,
      age,
      sex,
      yearsOfExperience,
      worksInShifts,
      pastWorks,
    });
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CashierCRUD.delete(id);
    res.status(200).send(true);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
