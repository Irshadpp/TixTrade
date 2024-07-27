import bcrypt from "bcrypt";

export class Password {
  static async toHash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Error hashing password');
    }
  }

  static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(suppliedPassword, storedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error('Error comparing passwords');
    }
  }
}
