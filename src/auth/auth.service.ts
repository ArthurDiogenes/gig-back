import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenPayload } from './auth';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const payload = {
      email: user.email,
      sub: {
        id: user.id,
        role: user.role,
      },
    };
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

  async getSession(user: TokenPayload) {
    this.logger.log(`Fetching session for user with ID: ${user.sub.id}`);

    const session = await this.userRepository.findOne({
      where: { id: user.sub.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        likes: {
          id: true,
          post: {
            id: true,
          },
        },
      },
      relations: ['likes', 'likes.post'],
    });

    console.log(session);

    if (!session) {
      this.logger.error(`Session not found for user ID: ${user.sub.id}`);
      throw new UnauthorizedException('Session not found');
    }

    const { likes, ...rest } = session;

    return {
      ...rest,
      likedPosts: likes.map((like) => like.post.id),
    };
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

    res.cookie('access_token', token.accessToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
      sameSite: 'strict', // Helps prevent CSRF attacks
    });

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
