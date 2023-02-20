import ReactSelect from "react-select";

function SelectCompo(props) {
  return (
    <div className="container border-bottom border-light border-3  ">
      <ReactSelect
        defaultValue={props.defaultValue}
        onChange={(opt) => props.setSelectedOption(opt)}
        options={props.options}
        placeholder={props.placeholder}
        isDisabled={props.isDisabled ? false : true}
        isMulti={props.isMulti ? true : false}
      />
    </div>
  );
}

export default SelectCompo;
