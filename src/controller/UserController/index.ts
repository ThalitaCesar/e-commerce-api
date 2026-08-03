import express from "express";
import { Request, Response } from "express";
import { UserData } from "../../data/UserData";
import { ROLES, User } from "../../models/UserModel";
import { Autheticator } from "../../services/Authenticator";
import { GenerateId } from "../../services/GenerateId";
import { HashManager } from "../../services/HashManager";
import { loginSchema, signUpSchema } from "../../validators/userValidator";

export class UserController {

  // Criar usuário 
   async signUpUser(req: Request, res: Response) {
      let erroStatus = 500;
      try {
        const validated = signUpSchema.parse(req.body);
        const { name, cpf, data, email, password, role } = validated;
        const id = new GenerateId().generateId();
        const normalizedRole = (role || ROLES.NORMAL) as ROLES;
        const newPassword = await new HashManager().generateHash(password);
        const newUser = new User(id, name, email, data, cpf, newPassword, normalizedRole);
        const userdata = new UserData();
        const result = await userdata.signUpUser(newUser);
        console.log(result);
        res.status(202).send({ result: result });
      } catch (error:any) {
        res.status(erroStatus).send(error.sqlMessage || error.message);
      }
    }
  
    async loginUser(req: Request, res: Response) {
      let erroStatus = 500;
      try {
        const validated = loginSchema.parse(req.body);
        const { email, password } = validated;
        const userData = new UserData();
        const [result] = await userData.loginUser(email);
        const authenticator = new Autheticator().generateToken(result);
        res.status(200).send({ result: authenticator });
      } catch (error:any) {
        res.status(erroStatus).send(error.message);
      }
    }
  
// Pegar todos os usuários

async getAllUsers(req: Request, res: Response) {
  let errorstatus = 500;
  try {
    const [user] = await new UserData().getAllUsers();
    const result = {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      data: user.data,
      email: user.email,
      role: user.role
    };
    res.status(200).send({ Result: result });
  } catch (error:any) {
    res.status(errorstatus).send(error.message || error.sqlMessage);
  }
}
    // Pega os dados do usuário logado

    async getProfile(req: Request, res: Response) {
      let erroStatus = 500;
      try {
        const token = req.headers.authorization as string;
        if (!token) {
          erroStatus = 401;
          throw new Error("Digite token no headers");
        }
        const newtoken = new Autheticator().tokenData(token);
        const [result] = await new UserData().getProfile(newtoken.id);
        res.status(200).send({ result: result });
      } catch (error:any) {
        res.status(erroStatus).send(error.sqlMessage || error.message);
      }
    }
  
    // Pega usuário especifico por id 

    async getProfileById(req: Request, res: Response) {
      let erroStatus = 500;
      try {
        const id = req.params.id as string;
        if ( !id) {
          erroStatus = 401;
          throw new Error("Digite parametros necessarios");
        }
        const [result] = await new UserData().getProfileById(id);
        res.status(200).send({ result: result });
      } catch (error:any) {
        res.status(erroStatus).send(error.sqlMessage || error.message);
      }
    }
     // Pega id do usuário por email 

     async getIdUserByEmail(req: Request, res: Response) {
      let erroStatus = 500;
      try {
        const email = req.params.email as string;
        const [result] = await new UserData().getIdUserByEmail(email);
        res.status(200).send({ result: result });
      } catch (error:any) {
        res.status(erroStatus).send(error.sqlMessage || error.message);
      }
    }

    // Alterar dados do usuário logado

    async updateProfile(req: Request, res: Response) {
      let errorstatus = 500;
      try {
        const {id, name, cpf, data, email} = req.body;
        if (!id) {
          errorstatus = 422;
          throw new Error("Parametro id e obrigatório");
        }
        const result = await new UserData().updateUser(
          id,
          name,
          cpf,
          data,
          email
        );
        res.status(201).send(result);
      } catch (error:any) {
        res.status(errorstatus).send(error.message || error.sqlMessage);
      }
    }
  
    // Excluir conta
    async deleteAccount(req: Request, res: Response) {
      let erroStatus = 500;
      try {
        const token:any = req.headers.authorization;
        const id = req.params.id;
        if (!token) {
          erroStatus = 422;
          throw new Error("Digite um token");
        }
        const result = await new UserData().deleteUser(id);
        res.status(200).send({ Result: result });
      } catch (error:any) {
        res.status(erroStatus).send(error.sqlMessage || error.message);
      }
    }

    async updatePassword(req: Request, res: Response) {
      let errorstatus = 500;
      try {
        const {id, password} = req.body;
        if (!id || !password) {
          errorstatus = 422;
          throw new Error("Parametro id e password são obrigatórios");
        }
  
        if (!id) {
          errorstatus = 422;
          throw new Error("Parametro id e obrigatório");}
        const result = await new UserData().updatePassword(
          id,
          password,
        );
        res.status(201).send(result);
      } catch (error:any) {
        res.status(errorstatus).send(error.message || error.sqlMessage);
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
 *       500:
 *         description: Erro interno
 */
userRouter.get('/profiles', userController.getAllUsers)

/**
 * @swagger
 * /user/profile/{id}:
 *   get:
 *     summary: Busca um usuário pelo id
 *     tags: [User]
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
 *         description: Parâmetro id não informado
 *       500:
 *         description: Erro interno
 */
userRouter.get('/profile/:id', userController.getProfileById)

/**
 * @swagger
 * /user/userid/{email}:
 *   get:
 *     summary: Busca o id de um usuário pelo email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Id encontrado
 *       500:
 *         description: Erro interno
 */
userRouter.get('/userid/:email', userController.getIdUserByEmail)

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT do usuário logado
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
 *         description: Token não informado
 *       500:
 *         description: Erro interno
 */
userRouter.get('/profile', userController.getProfile)

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
 *               role:
 *                 type: string
 *                 enum: [ADMIN, NORMAL]
 *     responses:
 *       202:
 *         description: Usuário criado com sucesso
 *       500:
 *         description: Erro de validação ou interno
 */
userRouter.post('/signup', userController.signUpUser)

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
 *       500:
 *         description: Credenciais inválidas ou erro interno
 */
userRouter.post('/login', userController.loginUser)

/**
 * @swagger
 * /user/updateuser:
 *   put:
 *     summary: Atualiza os dados do usuário
 *     tags: [User]
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
 *       422:
 *         description: Parâmetro id não informado
 *       500:
 *         description: Erro interno
 */
userRouter.put('/updateuser',userController.updateProfile)

/**
 * @swagger
 * /user/updatepassword/{id}:
 *   put:
 *     summary: Atualiza a senha do usuário
 *     tags: [User]
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
 *             required: [id, password]
 *             properties:
 *               id:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Senha atualizada com sucesso
 *       422:
 *         description: Parâmetros obrigatórios não informados
 *       500:
 *         description: Erro interno
 */
userRouter.put('/updatepassword/:id',userController.updatePassword)

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
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conta excluída com sucesso
 *       422:
 *         description: Token não informado
 *       500:
 *         description: Erro interno
 */
userRouter.delete('/deleteuser/:id', userController.deleteAccount)
