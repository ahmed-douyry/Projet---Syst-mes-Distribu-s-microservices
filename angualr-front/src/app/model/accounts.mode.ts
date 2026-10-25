export interface  Account {
  id?:String;
  balance? :number;
  createdAt?:Date;
  type?:String;
  customerID?:number;
}
export  enum RequestStatus{
  SUCCESS=0,ERROR = 1

}
export interface AccountList {
  accounts?:Account[]
  status?:RequestStatus
  errMessage?:String
}
