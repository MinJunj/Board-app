import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {

    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ){}

    createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto);
    }

    async getBoardById(id: any): Promise<Board> {
        const found = await this.boardRepository.findOne(id); //공식문서 왈// 버전 다운그레이드 하셈

        if(!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        return found;
    }    
    
    async deleteBoard(id:number): Promise<void> {
        const result = await this.boardRepository.delete(id);

        if(result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
    }
    
    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }

    async getAllBoards(): Promise<Board[]> {
        return this.boardRepository.find();
    }

        /*
    getAllBoards(): Board[] {
        return this.boards;
    }

    createBoard(createBoardDto: CreateBoardDto){
        const {title, description} = createBoardDto;

        const board: Board = {
            id: uuid(),
            title,
            description,
            status:BoardStatus.PUBLIC
        }

        this.boards.push(board);
        return board;
    }
    getboardById(id: string): Board {
        const found = this.boards.find((board) => board.id === id);

        if(!found) {
            throw new NotFoundException();
        }

        return found;
    }

    deleteBoard(id: string): void {
        const found = this.getboardById(id);
        this.boards = this.boards.filter((board) => board.id !== id);
    }

    updateBoardStatus(id: string, status: BoardStatus): Board {
        const board = this.getboardById(id);
        board.status = status;
        return board;
    }*/
}