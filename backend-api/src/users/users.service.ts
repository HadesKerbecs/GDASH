import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email });

    if (exists) {
      throw new BadRequestException("Já existe um usuário com este e-mail.");
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = new this.userModel({
      ...dto,
      password: hashed,
    });

    return user.save();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const updateData: any = { ...dto };

    if (dto.email) {
      const exists = await this.userModel.findOne({
        email: dto.email,
        _id: { $ne: id },
      });

      if (exists) {
        throw new ConflictException('Este e-mail já está em uso.');
      }
    }

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Usuário não encontrado');
  }
}
