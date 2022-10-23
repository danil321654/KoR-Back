import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/guards/google.guard'
// import { CardsService } from './cards.service'

@Controller()
export class CardsController {
  // constructor(/*private CardsService: CardsService*/) {}

  @Get('/cards')
  @UseGuards(AuthGuard)
  async geatCards(): Promise<any> {
    return []
  }
}
