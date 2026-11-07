export interface Account {
  id?: string;
  balance?: number;
  createdAt?: string | Date;
  type?: string;
  customerID?: number;
}

export enum RequestStatus {
  SUCCESS = 0,
  ERROR = 1,
  LOADING = 2,
}

export interface AccountList {
  accounts: Account[];
  status: RequestStatus;
  errMessage?: string;
}
