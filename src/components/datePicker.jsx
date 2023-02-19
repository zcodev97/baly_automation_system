import DateTimePicker from "react-datetime-picker";

function DatePickerCompo(title, dateValue, setDateValue) {
  return (
    <div className="container p-2">
      {title}
      {"  "}
      <DateTimePicker
        key={2}
        clearIcon={null}
        format={"y-MM-dd"}
        onChange={setDateValue}
        value={dateValue}
      />
    </div>
  );
}

export default DatePickerCompo;
