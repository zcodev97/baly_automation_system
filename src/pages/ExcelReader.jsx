import { useState } from "react";
import { read, utils } from "xlsx";
import NavBar from "../components/navBar";

function ExceReaderPage() {
  const [excelData, setExcelData] = useState([]);

  const [sheets, setSheets] = useState([]);

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = read(bufferArray, { type: "buffer" });
        setSheets(wb.SheetNames);
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <>
      <NavBar />
      <div className="container p-2 mt-2   border-2 border-bottom border-primary text-dark rounded">
        <h3 className="text-center">
          <b> Excel Reader</b>
        </h3>
      </div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcelFile(file)
            .then((data) => {
              console.log(data["Raw Data"]);
              //   setExcelData(data);
            })
            .catch((error) => console.log(error));
        }}
      />
      <div className="container">
        {sheets.length > 0 &&
          sheets.map((item, index) => (
            <div key={index}>
              <p>{item}</p>
            </div>
          ))}
      </div>
    </>
  );
}

export default ExceReaderPage;
