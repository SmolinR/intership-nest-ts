import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

import UsersModule from './users/users.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/users', module: UsersModule },
      { path: '/auth', module: AuthModule },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes), UsersModule, AuthModule],
})
export default class V1Module {}
