import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.logger.log('AuthService initialized');
  }

  /**
   * Validates a user by their email and password.
   *
   * @param email - The email of the user to validate.
   * @param password - The password of the user to validate.
   * @returns A promise that resolves to the validated user.
   * @throws {UnauthorizedException} If the credentials are invalid.
   */
  async validateUser(email: string, password: string): Promise<User> {
    this.logger.log(`Validating user with email: ${email}`);
    const user = await this.userService.getUserByEmail(email);
    if (!user || !bcryptjs.compareSync(password, user.password)) {
      this.logger.error('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async generateToken(user: User) {
    this.logger.log(`Generating JWT for user with email: ${user.email}`);
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async logout(res: Response) {
    // Clear the access_token cookie
    res.clearCookie('access_token');
    return res.status(200).json({ message: 'User logged out successfully' });
  }

  /**
   * Logs in a user with the provided email and password.
   *
   * @param body - An object containing the user's email and password.
   * @param body.email - The email of the user attempting to log in.
   * @param body.password - The password of the user attempting to log in.
   * @param res - The response object used to set the access token cookie and return the response.
   *
   * @returns A response object with a status of 200 and a JSON payload containing a success message,
   *          the user's information, and the access token.
   *
   * @throws Will throw an error if the user validation or token generation fails.
   */
  async login(body: { email: string; password: string }, res: Response) {
    this.logger.log(`Logging in user with email: ${body.email}`);

    // Validate user
    const user = await this.validateUser(body.email, body.password);

    // Generate token
    const token = await this.generateToken(user);

    // Return the user and the access token
    return res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      accessToken: token.accessToken,
    });
  }
}
