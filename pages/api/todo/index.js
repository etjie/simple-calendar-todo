import fs from "fs";
// import path from "path";
import uniqid from "uniqid";

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

module.exports = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      const read = await readFile();
      res.status(200).json({ status: "ok", data: read });
      break;
    case "POST":
      const { title, date } = req.body;
      let current = await readFile();
      const body = [...current, { id: uniqid(), title, date }];
      await writeFile(JSON.stringify(body));
      res.status(200).json({ status: "ok", data: body });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
