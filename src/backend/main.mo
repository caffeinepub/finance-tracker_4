import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type RecordType = {
    #income;
    #expense;
  };

  type FinancialRecord = {
    id : Nat;
    date : DateTime;
    description : Text;
    amount : Float;
    category : RecordType;
  };

  type DateTime = {
    year : Int;
    month : Nat;
    day : Int;
    hour : Int;
    minute : Int;
    second : Int;
  };

  module FinancialRecord {
    public func compareByDate(record1 : FinancialRecord, record2 : FinancialRecord) : Order.Order {
      compareDateTimes(record1.date, record2.date);
    };
  };

  func compareDateTimes(dt1 : DateTime, dt2 : DateTime) : Order.Order {
    let yearComparison = Int.compare(dt1.year, dt2.year);
    if (yearComparison != #equal) { return yearComparison };

    let monthComparison = Nat.compare(dt1.month, dt2.month);
    if (monthComparison != #equal) { return monthComparison };

    let dayComparison = Int.compare(dt1.day, dt2.day);
    if (dayComparison != #equal) { return dayComparison };

    let hourComparison = Int.compare(dt1.hour, dt2.hour);
    if (hourComparison != #equal) { return hourComparison };

    let minuteComparison = Int.compare(dt1.minute, dt2.minute);
    if (minuteComparison != #equal) { return minuteComparison };

    Int.compare(dt1.second, dt2.second);
  };

  var nextId = 0;
  let records = Map.empty<Nat, FinancialRecord>();

  public shared ({ caller }) func addRecord(date : DateTime, description : Text, amount : Float, category : RecordType) : async Nat {
    let record : FinancialRecord = {
      id = nextId;
      date;
      description;
      amount;
      category;
    };
    records.add(nextId, record);
    nextId += 1;
    record.id;
  };

  public query ({ caller }) func getRecords() : async [FinancialRecord] {
    records.values().toArray();
  };

  public query ({ caller }) func getRecordsSortedByDate() : async [FinancialRecord] {
    records.values().toArray().sort(FinancialRecord.compareByDate);
  };

  public shared ({ caller }) func deleteRecord(id : Nat) : async () {
    if (not records.containsKey(id)) {
      Runtime.trap("Record with ID does not exist.");
    };
    records.remove(id);
  };
};
