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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BandsService } from './bands.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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

  @Get(':id/reviews')
  getReviewsByBandId(@Param('id', ParseUUIDPipe) id: string) {
    return this.bandsService.getReviewsByBandId(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bandsService.findOne(id);
  }

  @Get('user/:id')
  findBandByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.bandsService.findBandByUser(id);
  }

  @Patch('user/:userId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 }, // Nome atualizado
      { name: 'coverPicture', maxCount: 1 }, // Nome atualizado
    ]),
  )
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateBandDto: UpdateBandDto,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      coverPicture?: Express.Multer.File[];
    },
  ) {
    const profilePicture = files?.profilePicture?.[0];
    const coverPicture = files?.coverPicture?.[0];
    console.log('Data:', updateBandDto);
    return this.bandsService.updateByUserId(userId, updateBandDto, {
      profilePicture,
      coverPicture,
    });
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
