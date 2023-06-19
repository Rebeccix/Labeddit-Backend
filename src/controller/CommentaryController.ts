import { Request, Response } from "express";
import { ZodError } from "zod";
import { CommentaryBusiness } from "../business/CommentaryBusiness";
import { BaseError } from "../errors/BaseError";
import { CreateCommentaryPostScheama } from "../dtos/commentary/createCommentary.dto";
import { GetCommentaryByIdScheama } from "../dtos/commentary/getCommentaryById.dto";

export class CommentaryController {
  constructor(private commentaryBusiness: CommentaryBusiness) {}

  public createCommentary = async (req: Request, res: Response) => {
    try {
      const input = CreateCommentaryPostScheama.parse({
        token: req.headers.authorization,
        id: req.params.id,
        content: req.body.content,
      });

      const output = await this.commentaryBusiness.createCommentary(input);

      res.status(201).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public getCommentaryById = async (req: Request, res: Response) => {
    try {
      const input = GetCommentaryByIdScheama.parse({
        token: req.headers.authorization,
        id: req.params.id
      })      

      const output = await this.commentaryBusiness.getCommentaryById(input)

      res.status(200).send(output)

    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
