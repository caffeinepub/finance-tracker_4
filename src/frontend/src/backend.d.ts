import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DateTime {
    day: bigint;
    month: bigint;
    hour: bigint;
    year: bigint;
    minute: bigint;
    second: bigint;
}
export interface FinancialRecord {
    id: bigint;
    date: DateTime;
    description: string;
    category: RecordType;
    amount: number;
}
export enum RecordType {
    expense = "expense",
    income = "income"
}
export interface backendInterface {
    addRecord(date: DateTime, description: string, amount: number, category: RecordType): Promise<bigint>;
    deleteRecord(id: bigint): Promise<void>;
    getRecords(): Promise<Array<FinancialRecord>>;
    getRecordsSortedByDate(): Promise<Array<FinancialRecord>>;
}
