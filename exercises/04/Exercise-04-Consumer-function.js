exports.handler = async function (event) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  const { Records } = event;
  
  Records.forEach(element => {
    const { body } = element;
    console.log(JSON.parse(body))

    // TODO NEXT
    // Insert Records into DB

    // If possible, check batch receive functionality
  });
};
