function NotationScientiqueToFloat(svgContent) {
  // transforme les valeurs écrite 10e-5 en float
  let count = 0;
  svgContent.forEach((element) => {
    if (element.includes("e")) {
      let eElem = element.split(",");
      if (eElem.length >= 2) {
        if (eElem[0].includes("e")) {
          eElem = parseFloat(eElem[0]);
          svgContent[count] = eElem + "," + element.split(",")[1];
        } else {
          if (element[1].includes("e")) {
            eElem = parseFloat(eElem[1]);
            svgContent[count] = element.split(",")[0] + "," + eElem;
          }
        }
      }
    }
    count++;
  });
  return svgContent;
}

function TransformeCoordonnees(rawCoordonnees) {
  let returnCoordonnees = [];
  if (rawCoordonnees !== undefined) {
    for (let i = 0; i < rawCoordonnees.length; i++) {
      switch (rawCoordonnees[i][0]) {
        case "M":
          returnCoordonnees.push({
            x: parseFloat(rawCoordonnees[i][1]),
            z: parseFloat(rawCoordonnees[i][2]),
          });
          break;
        case "H":
          returnCoordonnees.push({
            x: parseFloat(rawCoordonnees[i][1]),
            z: returnCoordonnees[i - 1].z,
          });
          break;
        case "L":
          returnCoordonnees.push({
            x: parseFloat(rawCoordonnees[i][1]),
            z: parseFloat(rawCoordonnees[i][2]),
          });
          break;
        case "V":
          returnCoordonnees.push({
            x: returnCoordonnees[i - 1].x,
            z: parseFloat(rawCoordonnees[i][1]),
          });
          break;
        case "Z":
          returnCoordonnees.push({
            x: parseFloat(returnCoordonnees[0].x),
            z: parseFloat(returnCoordonnees[0].z),
          });
          break;
        default:
          break;
      }
    }
  }
  console.log({ rawCoordonnees });
  console.log({ returnCoordonnees });
  return returnCoordonnees;
}
