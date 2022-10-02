import { Controller, Get, Req, Res, Delete } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { AppService } from './app.service'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
)

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/checkAuth')
  async checkAuth(@Req() request): Promise<any> {
    try {
      const ticket = await client.verifyIdToken({
        idToken: request.cookies['token'],
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()
      const data = await this.appService.login({
        email: payload.email,
        name: payload.name,
        image: payload.picture.replace('lh3', 'ap2'),
      })

      return data
    } catch {
      return null
    }
  }

  @Get('/login')
  async login(
    @Req() request,
    @Res({ passthrough: true }) response,
  ): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: request.headers.authorization,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const data = await this.appService.login({
      email: payload.email,
      name: payload.name,
      image: payload.picture.replace('lh3', 'ap2'),
    })
    response.cookie('token', request.headers.authorization, {
      httpOnly: true,
      domain: process.env.CLIENT_DOMAIN,
    })
    return data
  }

  @Delete('/logout')
  async logout(@Res() response): Promise<any> {
    response.clearCookie('token', {
      httpOnly: true,
      domain: process.env.CLIENT_DOMAIN,
    })
    response.end()
  }
}
