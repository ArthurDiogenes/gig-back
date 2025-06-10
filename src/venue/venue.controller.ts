import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  create(@Body() createVenueDto: CreateVenueDto) {
    return this.venueService.create(createVenueDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.venueService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.venueService.findOne(id);
  }

  @Get('user/:id')
  findVenueByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.venueService.findVenueByUser(id);
  }

  @Patch('user/:userId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverPhoto', maxCount: 1 },
      { name: 'profilePhoto', maxCount: 1 },
    ]),
  )
  async update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @UploadedFiles()
    files: {
      coverPhoto?: Express.Multer.File[];
      profilePhoto?: Express.Multer.File[];
    },
  ) {
    return this.venueService.updateByUserId(userId, updateVenueDto, {
      coverPhoto: files.coverPhoto ? files.coverPhoto[0] : null,
      profilePhoto: files.profilePhoto ? files.profilePhoto[0] : null,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.venueService.remove(id);
  }
}
