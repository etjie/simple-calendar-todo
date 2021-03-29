import fs from "fs";
// import path from "path";

import serverPath from "../../../helper/serverPath";

const jsonFile = "public/json/data.json";
const headers = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
};

// const jsonDir = "json";
// const dir = path.resolve("./public", jsonDir);
// const filenames = fs.readdirSync(dir);
// const jsonFile = filenames.map((name) => path.join("/", jsonDir, name));

const readFile = async () => {
  try {
    const content = await fs.readFileSync(serverPath(jsonFile));
    return JSON.parse(content);
  } catch (err) {
    console.log(`Error reading file: ${err}`);
    return;
  }
};

const writeFile = async (body) => {
  try {
    const content = await fs.writeFileSync(serverPath(jsonFile), body);
    return JSON.parse(content);
  } catch (err) {
    console.log(`Error reading file: ${err}`);
    return;
  }
};

const readSingle = async (objectId) => {
  const read = await readFile();
  const result = read.find((obj) => obj.id === objectId);
  return result;
};

module.exports = async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      const single = await readSingle(id);
      res.status(200).json({ status: "ok", data: single });
      break;
    case "PUT":
      const { title, date } = req.body;
      let body = await readFile();
      const objIndex = body.findIndex((obj) => obj.id === id);
      body[objIndex] = {
        id,
        title,
        date,
      };
      await writeFile(JSON.stringify(body));
      res.status(200).json({ status: "ok", data: body });
      break;
    case "DELETE":
      let array = await readFile();
      const arrayIndex = array.findIndex((obj) => obj.id === id);
      array.splice(arrayIndex, 1);
      await writeFile(JSON.stringify(array));
      res.status(200).json({ status: "ok", data: array });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
