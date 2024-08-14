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
  url: 'url',
  options: {
    a: 'optionA',
    b: 'optionB',
    c: 'optionC',
    d: 'optionD',
  },
  rightAnswer: 'rightAnswer',
  topico: 'topico',
}


function formatedJson(exFormated, oldData) {
  let data = exFormated;
  Object.keys(exFormated).forEach((item) => {
    const currentItem = exFormated[item];
    if (typeof currentItem === "object") {
      let subData = currentItem;

      Object.keys(currentItem).forEach((item2) => {
        currentItem[item2] = oldData[item2];
      });
      data[item] = subData;
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

        let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[1]]);
        const rowObjectNew = rowObject.map((column) => {
          let data = {};
          Object.keys(column).forEach((item) => {
            const newItem = column[item];
            if (item === 'url') {
              data = {
                ...data,
                [item]: `require('../assets/transitBoard/${newItem}').default`,
              }
            } else {
              data = {
                ...data,
                [item]: newItem,
              }
            };
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

        const removedAspaURL = transformedObject.replace(/url: '/g, `url:  `);
        const removedAspaURLFinal = removedAspaURL.replace(/.default'/g, `.default`);
        document.getElementById("jsondata").innerHTML = removedAspaURLFinal;
        navigator.clipboard.writeText(removedAspaURLFinal);
      }
    }
});