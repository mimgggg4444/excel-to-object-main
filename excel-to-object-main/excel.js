let selectedFile;
document.getElementById('input').addEventListener("change", (event) => {
  selectedFile = event.target.files[0];
  // Assim que colocar um arquivo ele da um preview de como vai ficar e a baixo a formatação
})

let data=[{
  "name":"jayanth",
  "data":"scd",
  "abc":"sdef"
}]

const exFormated1 = {
  id: 'id',
  problem: 'problem',
  url: '',
  options: {
    a: 'a',
    b: 'b',
    c: 'c',
    d: 'd',
  },
  rightAnswer: 'rightAnswer',
  topico: 'topico',
}


function formatedJson(exFormated, oldData) {
  const data = exFormated;
  const subData = {};
  Object.keys(exFormated).forEach((item) => {
    const currentItem = exFormated[item];
    if (typeof currentItem === "object") {
      Object.keys(currentItem).forEach((item2) => {
        console.log('currentItem' , item2);
        // subData = {
        //   ...subData,
        //   [item2]: currentItem[item2],
        // }
      });
      console.log('[subData]', subData);
      data.options = subData;
    } else {
      data[item] = oldData[item];
    }
  });
  return data;
}

document.getElementById('button').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if(selectedFile){
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload = (event)=>{
        let data = event.target.result;
        let workbook = XLSX.read(data,{ type:"binary" });

        let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
        const headerExcel = rowObject[0];
        rowObject.shift();

        const rowObjectNew = rowObject.map((column) => {
          let data = {};
          Object.keys(column).forEach((item) => {
            const newItem = column[item];
            data = {
              ...data,
              url: '',
              [headerExcel[item]]: newItem,
            }
          });
          const newData = {
            id: data.id,
            problem: data.problem,
            url: data.url,
            options: {
              a: data.a,
              b: data.b,
              c: data.c,
              d: data.d,
            },
            rightAnswer: data.rightAnswer,
            topico: data.topico,
          }
          // const currentFormattingForJson = formatedJson(exFormated1, data);
          return { ...newData };
        }); 
        const jsonFormated = JSON.stringify(rowObjectNew, undefined, 4);
        const revomedAspas = jsonFormated.replace(/"/g, `'`);

        const transformedObject1 = revomedAspas.replace(/(':)/g, `:`);

        const transformedObject = transformedObject1.replace(/     '/g, `     `);
        document.getElementById("jsondata").innerHTML = transformedObject;
        
        
        navigator.clipboard.writeText(transformedObject);
      }
    }
});