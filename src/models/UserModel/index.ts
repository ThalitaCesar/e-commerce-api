export enum ROLES {
    ADMIN = "ADMIN",
    NORMAL = "NORMAL",
  }
  
  export class User {
    constructor(
      private id: string,
      private name: string,
      private email: string,
      private data: string,
      private cpf: string,
      private password: string,
      private role: ROLES,
    ) {}
    getId() {
      return this.id;
    }
  
    getName() {
      return this.name;
    }
  
    getEmail() {
      return this.email;
    }

    getData() {
      return this.data;
    }

    getCpf() {
      return this.cpf;
    }
  
    getPassword() {
      return this.password;
    }
  
    getRole() {
      return this.role;
    }

  }