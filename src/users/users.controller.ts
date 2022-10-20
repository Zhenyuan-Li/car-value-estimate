import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Session,
  NotFoundException,
  UseGuards,
  // UseInterceptors,
  // ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiCookieAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';

import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

// We put a global serializer, if Admin & Public routes exit, and need to
// return different kind of responses. Just add it locally and different dto.
@Serialize(UserDto)
@Controller('auth')
// // Downside of this approach: if multiple controllers (which needs this ) exits,
// // we have to add this interceptor to everywhere. This approach is comprehensive, but not smart. Make it globally
// @UseInterceptors(CurrentUserInterceptor)
@ApiTags('User')
export class UsersController {
  // TODO: NotFoundError handling for all routes
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiCreatedResponse({
    description: 'User Registration',
    type: UserDto,
  })
  @ApiBadRequestResponse({ description: 'Email is in use' })
  @ApiBody({ type: CreateUserDto })
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @ApiCreatedResponse({ description: 'User Login', type: UserDto })
  @ApiBadRequestResponse({ description: 'Password is wrong' })
  @ApiNotFoundResponse({ description: 'User not found' })
  // @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: CreateUserDto })
  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @ApiResponse({ status: 200, description: 'Here you are', type: UserDto })
  @ApiCookieAuth()
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
  // Another approach without customized decorator. A little bit tedious
  // whoAmI(@Request() user: Request) {
  //   return request.currentUser;
  // }

  @ApiCookieAuth()
  @ApiResponse({ status: 201, description: 'Sign out successfully' })
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Fetch User with ID',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  // Param return string
  async findUser(@Param('id') id: string) {
    console.log('handler is running');
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Fetch all user with email',
    type: UserDto,
  })
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Delete User with ID',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Update User with ID',
    type: UpdateUserDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Patch('/:id')
  // Create a new complicated DTO first
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
