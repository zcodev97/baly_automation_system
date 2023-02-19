// for excel and pdf
import * as XLSX from "xlsx";

function ExcelExport(data, fileName, startDate, endDate) {
  let formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
  let formattedEndDate = new Date(endDate).toISOString().slice(0, 10);
  //convert json to excel
  const JSONToExcel = (jsonData, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  return (
    <div
      className="container btn btn-light border border-success text-success"
      onClick={() => {
        JSONToExcel(
          data,
          `${fileName}_from ${formattedStartDate}_to ${formattedEndDate}`
        );
      }}
    >
      <b> Export Excel</b>
    </div>
  );
}

export default ExcelExport;
