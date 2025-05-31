import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BandsService } from './bands.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';

@Controller('bands')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Post()
  create(@Body() createBandDto: CreateBandDto) {
    return this.bandsService.create(createBandDto);
  }

  @Get()
  findAll() {
    return this.bandsService.findAll();
  }

  @Get('featured')
  getFeaturedBands(@Query('limit') limit: string = '2') {
    return this.bandsService.getFeaturedBands(+limit);
  }

  @Get('pesquisa')
  search(
    @Query('name') name?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.bandsService.search(name, +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bandsService.findOne(id);
  }

  @Get('user/:id')
  findBandByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.bandsService.findBandByUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBandDto: UpdateBandDto) {
    return this.bandsService.update(+id, updateBandDto);
  }

  @Put(':id')
  updateBand(@Param('id') id: number, @Body() updateBandDto: UpdateBandDto) {
    console.log('Data', updateBandDto);
    return this.bandsService.updateBand(id, updateBandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bandsService.remove(+id);
  }
}
