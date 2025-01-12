// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  async register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
    schema: { type: 'object', properties: { accessToken: { type: 'string' } } },
  })
  async refresh(@Body() body: RefreshTokenDto) {
    const accessToken = this.authService.refreshAccessToken(body.refreshToken);
    return { accessToken };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'User profile',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        username: { type: 'string' },
        role: { type: 'string' },
      },
    },
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
