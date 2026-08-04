import express from "express";
import { NextFunction, Request, Response } from "express";
import { UserData } from "../../data/UserData";
import { ROLES, User } from "../../models/UserModel";
import { Autheticator } from "../../services/Authenticator";
import { GenerateId } from "../../services/GenerateId";
import { HashManager } from "../../services/HashManager";
import {
  loginSchema,
  signUpSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "../../validators/userValidator";
import { AppError } from "../../utils/AppError";
import { authenticate, requireAdmin, requireSelfOrAdmin } from "../../middlewares/authMiddleware";
import { authLimiter } from "../../middlewares/rateLimiter";

export class UserController {

  // Criar usuário
   async signUpUser(req: Request, res: Response, next: NextFunction) {
      try {
        const validated = signUpSchema.parse(req.body);
        const { name, cpf, data, email, password } = validated;
        const id = new GenerateId().generateId();
        const hashedPassword = await new HashManager().generateHash(password);
        const newUser = new User(id, name, email, data, cpf, hashedPassword, ROLES.NORMAL);
        const userdata = new UserData();
        await userdata.signUpUser(newUser);
        const token = new Autheticator().generateToken(id, ROLES.NORMAL);
        res.status(202).send({ result: { id, name, email, role: ROLES.NORMAL, token } });
      } catch (error) {
        next(error);
      }
    }

    async loginUser(req: Request, res: Response, next: NextFunction) {
      try {
        const validated = loginSchema.parse(req.body);
        const { email, password } = validated;
        const user = await new UserData().getProfileByEmail(email);
        if (!user) {
          throw new AppError("Credenciais inválidas", 401);
        }
        const validPassword = await new HashManager().compareHash(password, user.password);
        if (!validPassword) {
          throw new AppError("Credenciais inválidas", 401);
        }
        const token = new Autheticator().generateToken(user.id, user.role);
        res.status(200).send({ result: token });
      } catch (error) {
        next(error);
      }
    }

// Pegar todos os usuários (admin)

async getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await new UserData().getAllUsers();
    res.status(200).send({ Result: users });
  } catch (error) {
    next(error);
  }
}
    // Pega os dados do usuário logado

    async getProfile(req: Request, res: Response, next: NextFunction) {
      try {
        const [result] = await new UserData().getProfile(req.user!.id);
        res.status(200).send({ result: result });
      } catch (error) {
        next(error);
      }
    }

    // Pega usuário especifico por id

    async getProfileById(req: Request, res: Response, next: NextFunction) {
      try {
        const id = req.params.id as string;
        const [result] = await new UserData().getProfileById(id);
        res.status(200).send({ result: result });
      } catch (error) {
        next(error);
      }
    }
     // Pega id do usuário por email

     async getIdUserByEmail(req: Request, res: Response, next: NextFunction) {
      try {
        const email = req.params.email as string;
        const [result] = await new UserData().getIdUserByEmail(email);
        res.status(200).send({ result: result });
      } catch (error) {
        next(error);
      }
    }

    // Alterar dados do usuário logado

    async updateProfile(req: Request, res: Response, next: NextFunction) {
      try {
        const validated = updateProfileSchema.parse(req.body);
        const isAdmin = req.user!.role === ROLES.ADMIN;
        const id = isAdmin ? validated.id : req.user!.id;
        const result = await new UserData().updateUser(
          id,
          validated.name as string,
          validated.cpf as string,
          validated.data as string,
          validated.email as string
        );
        res.status(201).send(result);
      } catch (error) {
        next(error);
      }
    }

    // Excluir conta
    async deleteAccount(req: Request, res: Response, next: NextFunction) {
      try {
        const id = req.params.id;
        const result = await new UserData().deleteUser(id);
        res.status(200).send({ Result: result });
      } catch (error) {
        next(error);
      }
    }

    async updatePassword(req: Request, res: Response, next: NextFunction) {
      try {
        const validated = updatePasswordSchema.parse(req.body);
        const isAdmin = req.user!.role === ROLES.ADMIN;
        const id = isAdmin ? validated.id : req.user!.id;
        const userData = new UserData();
        const hashManager = new HashManager();

        if (!isAdmin) {
          if (!validated.currentPassword) {
            throw new AppError("Senha atual é obrigatória", 422);
          }
          const targetUser = await userData.getById(id);
          if (!targetUser) {
            throw new AppError("Usuário não encontrado", 404);
          }
          const validPassword = await hashManager.compareHash(validated.currentPassword, targetUser.password);
          if (!validPassword) {
            throw new AppError("Senha atual incorreta", 401);
          }
        }

        const newHashedPassword = await hashManager.generateHash(validated.newPassword);
        const result = await userData.updatePassword(id, newHashedPassword);
        res.status(201).send(result);
      } catch (error) {
        next(error);
      }
    }
}


// Rotas

export const userRouter = express.Router()

const userController = new UserController()

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Cadastro, autenticação e gerenciamento de usuários
 */

/**
 * @swagger
 * /user/profiles:
 *   get:
 *     summary: Lista os usuários cadastrados
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Result:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Erro interno
 */
userRouter.get('/profiles', authenticate, requireAdmin, userController.getAllUsers)

/**
 * @swagger
 * /user/profile/{id}:
 *   get:
 *     summary: Busca um usuário pelo id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno
 */
userRouter.get('/profile/:id', authenticate, requireSelfOrAdmin((req) => req.params.id), userController.getProfileById)

/**
 * @swagger
 * /user/userid/{email}:
 *   get:
 *     summary: Busca o id de um usuário pelo email
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Id encontrado
 *       401:
 *         description: Token não informado ou inválido
 *       500:
 *         description: Erro interno
 */
userRouter.get('/userid/:email', authenticate, userController.getIdUserByEmail)

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token não informado ou inválido
 *       500:
 *         description: Erro interno
 */
userRouter.get('/profile', authenticate, userController.getProfile)

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, cpf, data, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               cpf:
 *                 type: string
 *               data:
 *                 type: string
 *                 description: Data de nascimento
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       202:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 *       429:
 *         description: Muitas tentativas
 *       500:
 *         description: Erro interno
 */
userRouter.post('/signup', authLimiter, userController.signUpUser)

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso, retorna o token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Token JWT
 *       401:
 *         description: Credenciais inválidas
 *       429:
 *         description: Muitas tentativas
 *       500:
 *         description: Erro interno
 */
userRouter.post('/login', authLimiter, userController.loginUser)

/**
 * @swagger
 * /user/updateuser:
 *   put:
 *     summary: Atualiza os dados do usuário autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               cpf:
 *                 type: string
 *               data:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não informado ou inválido
 *       500:
 *         description: Erro interno
 */
userRouter.put('/updateuser', authenticate, userController.updateProfile)

/**
 * @swagger
 * /user/updatepassword/{id}:
 *   put:
 *     summary: Atualiza a senha do usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, newPassword]
 *             properties:
 *               id:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não informado, inválido, ou senha atual incorreta
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno
 */
userRouter.put('/updatepassword/:id', authenticate, requireSelfOrAdmin((req) => req.params.id), userController.updatePassword)

/**
 * @swagger
 * /user/deleteuser/{id}:
 *   delete:
 *     summary: Exclui a conta do usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conta excluída com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno
 */
userRouter.delete('/deleteuser/:id', authenticate, requireSelfOrAdmin((req) => req.params.id), userController.deleteAccount)
