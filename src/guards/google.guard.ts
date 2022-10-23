import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { client } from './google.client'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    try {
      await client.verifyIdToken({
        idToken: request.cookies['token'],
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      return true
    } catch {
      return false
    }
  }
}
