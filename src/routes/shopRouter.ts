import express, { Request, Response } from 'express';
import { ShopCRUD } from '../db';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await ShopCRUD.read();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await ShopCRUD.read({ id });
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name, city, address,
    } = req.body;
    const newItem = await ShopCRUD.create({
      name,
      city,
      address,
    });
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const {
      id, name, city, address,
    } = req.body;
    const newItem = await ShopCRUD.update(id, {
      name, city, address,
    });
    res.status(200).send(newItem);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ShopCRUD.delete(id);
    res.status(200).send(true);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
