import { Request, Response } from 'express';
import { register, findUserByEmail, login } from '../services/user.service';

export const currentUser = async (req: Request, res: Response) => {
  const currentUser = req.user;
  try {
    if (!currentUser) {
      return res.status(400).send({ err: 'User not logged in' });
    }

    const userDoc = await findUserByEmail(currentUser.email);

    const user = userDoc?.toJSON() as any;
    delete user?.password;

    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).send({ err: err });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fname, lname, password, email } = req.body;
    const existUser = await findUserByEmail(email);
    if (existUser) {
      return res.status(400).send({
        err: 'User Alrady Exists ',
      });
    }
    const newUser = await register(fname, lname, password, email, 'User');
    res.status(201).send(newUser);
  } catch (err: any) {
    res.status(400).send({ err: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    const payload = await login(password, email);

    res.status(201).send(payload);
  } catch (err: any) {
    res.status(400).send({ err: err.message });
  }
};
