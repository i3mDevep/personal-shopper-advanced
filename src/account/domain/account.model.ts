export class AccountModel {
  constructor(
    public account: string,
    public storeName?: string,
    public urlCss?: string,
    public active?: boolean,
    public templateEmail?: string,
    public templateNotifyClient?: string
  ) {}
}
