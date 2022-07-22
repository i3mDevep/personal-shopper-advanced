export class CaseModel {
  constructor(
    public id: string,
    public account?: string,
    public state?: string,
    public advisor?: string,
    public fullName?: string,
    public email?: string,
    public phone?: string,
    public createdAt?: number,
    public meetAt?: number,
    public finishAt?: number
  ) {}
}
