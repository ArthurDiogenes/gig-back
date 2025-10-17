import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { Venue } from 'src/venue/venue.entity';
import { Band } from 'src/bands/band.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,

    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,

    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createContract(createContractDto: CreateContractDto) {
    const { requesterId, providerId, ...rest } = createContractDto;

    const requester = await this.venueRepository.findOneBy({ id: requesterId });
    if (!requester) {
      throw new BadRequestException(
        `Venue (requester) with ID ${requesterId} not found`,
      );
    }

    const provider = await this.bandRepository.findOneBy({ id: providerId });
    if (!provider) {
      throw new BadRequestException(
        `Band (provider) with ID ${providerId} not found`,
      );
    }

    const contract = this.contractRepository.create({
      ...rest,
      requester,
      provider,
    });

    await this.contractRepository.save(contract);

    this.logger.log(`Contract created: ${contract.id}`);
    return contract;
  }

  async getContracts() {
    return await this.contractRepository.find({
      relations: ['requester', 'provider'],
    });
  }

  async getContractById(id: string) {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['requester', 'provider'],
    });
    if (!contract) {
      throw new BadRequestException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async getContractsByBand(bandId: number) {
    const band = await this.bandRepository.findOne({
      where: { id: bandId },
    });

    if (!band) {
      throw new BadRequestException(`Band with ID ${bandId} not found`);
    }

    const contracts = await this.contractRepository.find({
      where: { provider: { id: bandId } },
      relations: ['requester'],
    });

    return contracts;
  }

  async getContractsByVenue(venueId: string) {
    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
    });

    if (!venue) {
      throw new BadRequestException(`Venue with ID ${venueId} not found`);
    }

    const contracts = await this.contractRepository.find({
      where: { requester: { id: venueId } },
      relations: ['provider'],
    });

    return contracts;
  }

  // A assinatura agora recebe userId em vez de bandId
  async respondToContract(
    contractId: string,
    accepted: boolean,
    userId: string,
  ): Promise<Contract> {
    // 2. Buscar o usuário e sua relação com a banda
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['band'], // Garante que a propriedade 'band' seja carregada
    });

    // 3. Validar se o usuário é uma banda
    if (!user || !user.band) {
      throw new ForbiddenException(
        'Apenas bandas podem responder a contratos.',
      );
    }

    const bandId = user.band.id; // Pegamos o ID da banda aqui

    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: ['provider'],
    });

    if (!contract) {
      throw new NotFoundException(
        `Contrato com ID "${contractId}" não encontrado.`,
      );
    }
    if (contract.provider.id !== bandId) {
      // A validação continua a mesma
      throw new ForbiddenException(
        'Você não tem permissão para responder a este contrato.',
      );
    }
    if (contract.status !== 'pending') {
      throw new BadRequestException(
        'Este contrato não está mais pendente de resposta.',
      );
    }

    contract.status = accepted ? 'confirmed' : 'declined';
    return this.contractRepository.save(contract);
  }

  async cancelContract(contractId: string, userId: string): Promise<Contract> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['venue'],
    });

    if (!user || !user.venue) {
      throw new ForbiddenException(
        'Apenas estabelecimentos podem cancelar contratos.',
      );
    }

    const venueId = user.venue.id;

    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: ['requester'],
    });

    if (!contract) {
      throw new NotFoundException(
        `Contrato com ID "${contractId}" não encontrado.`,
      );
    }

    if (contract.requester.id !== venueId) {
      throw new ForbiddenException(
        'Você não tem permissão para cancelar este contrato.',
      );
    }

    if (contract.status === 'declined' || contract.status === 'canceled') {
      throw new BadRequestException(
        `Não é possível cancelar um contrato com o status "${contract.status}".`,
      );
    }

    // ====================================================================
    //  ↓↓↓ NOVA VERIFICAÇÃO DE DATA ADICIONADA AQUI ↓↓↓
    // ====================================================================
    const today = new Date();
    const eventDate = new Date(contract.eventDate);

    // Zera a hora do dia de hoje para comparar apenas as datas
    today.setHours(0, 0, 0, 0);

    // Calcula a diferença em milissegundos e converte para dias
    const differenceInTime = eventDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // Se a diferença for de 7 dias ou menos, lança um erro
    if (differenceInDays <= 7) {
      throw new BadRequestException(
        'Não é possível cancelar um contrato com 7 dias ou menos de antecedência.',
      );
    }

    // Se passar na verificação, o contrato é cancelado
    contract.status = 'canceled';
    return this.contractRepository.save(contract);
  }

  async deleteContract(id: string) {
    const contract = await this.contractRepository.findOne({
      where: { id },
    });
    if (!contract) {
      throw new BadRequestException(`Contract with ID ${id} not found`);
    }
    await this.contractRepository.delete(id);
  }
}
