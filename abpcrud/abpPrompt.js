/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */
const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");

function getFolder(path) {
  const components = [path];
  const files = fs.readdirSync(path);
  files.forEach((item) => {
    const stat = fs.lstatSync(`${path}/${item}`);
    if (stat.isDirectory() === true && item !== "components") {
      components.push(...getFolder(`${path}/${item}`));
    }
  });
  return components;
}
const swaggerFileJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../apifiles/swagger.json"))
);
const applicationFileJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../apifiles/application.json"))
);

const moduleFileJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../apifiles/definition.json"))
);
function getModule() {
  // const ret = fs.readFileSync(
  //   path.join(__dirname, "../../apifiles/definition.json")
  // );
  // const res = JSON.parse(ret);

  const moduleNames = Object.keys(moduleFileJson.modules);
  return moduleNames;
}
let currentModule = "";
let currentService = "";
let currentServiceName = "";
function getService(obj) {
  currentModule = obj.module;
  return Object.keys(moduleFileJson.modules[currentModule].controllers);
}
const createParas = {};
const showTypes = {};
function getTypes(obj) {
  currentService = obj.appService;

  const serviceName =
    moduleFileJson.modules[currentModule].controllers[currentService]
      .controllerName;
  currentServiceName = serviceName;
  const appServiceName = `${serviceName}AppService`;
  const listDtoName = currentService.replace(
    appServiceName,
    `Dtos.${serviceName}Dto`
  );

  const createUpdateDtoName = currentService.replace(
    appServiceName,
    `Dtos.CreateUpdate${serviceName}Dto`
  );

  // .Dtos.StationPointDto
  createParas.type = swaggerFileJson.components.schemas[createUpdateDtoName];
  createParas.url =
    moduleFileJson.modules[currentModule].controllers[
      currentService
    ].actions.CreateAsyncByInput.url;

  showTypes.type = swaggerFileJson.components.schemas[listDtoName];
  showTypes.url =
    moduleFileJson.modules[currentModule].controllers[
      currentService
    ].actions.GetListAsyncByInput.url;

  getLocationString();

  return getFolder("src/views");
}

function getLocationString() {
  showTypes.location = [];
  createParas.location = [];
  const currentModuleName =
    currentModule.slice(0, 1).toUpperCase() + currentModule.slice(1);
  const ignoreProp = [
    "id",
    "creationTime",
    "creatorId",
    "lastModificationTime",
    "lastModifierId",
    "isDeleted",
    "deleterId",
    "deletionTime",
  ];

  Object.keys(showTypes.type.properties).forEach((element) => {
    if (!ignoreProp.includes(element)) {
      let eleName = element.slice(0, 1).toUpperCase() + element.slice(1);

      if (eleName === "Id") {
        eleName = "";
      }
      // console.log(currentModuleName);
      // console.log(applicationFileJson.localization.values[currentModuleName]);

      const a = {
        name: element,
        cname:
          applicationFileJson.localization.values[currentModuleName][
            currentServiceName + eleName
          ],
      };
      showTypes.location.push(a);
    }
  });

  Object.keys(createParas.type.properties).forEach((element) => {
    const eleName = element.slice(0, 1).toUpperCase() + element.slice(1);
    const a = {
      name: element,
      cname:
        applicationFileJson.localization.values[currentModuleName][
          currentServiceName + eleName
        ],
    };
    createParas.location.push(a);
  });
}
module.exports = {
  description: "????????????????????????????????????&????????????",
  prompts: [
    {
      type: "list",
      name: "module",
      message: "????????????",
      choices: getModule(),
    },
    {
      type: "list",
      name: "appService",
      message: "????????????",
      choices: getService,
    },
    {
      type: "list",
      name: "path",
      message: "???????????????????????????",
      choices: getTypes,
    },
    {
      type: "input",
      name: "name",
      message: "??????????????????",
      validate: (v) => {
        if (!v || v.trim === "") {
          return "?????????????????????";
        } else {
          return true;
        }
      },
    },
    {
      type: "input",
      name: "cname",
      message: "???????????????????????????",
      default: "????????????",
    },
  ],
  actions: (data) => {
    const relativePath = path.relative("src/views", data.path);

    const actions = [
      {
        type: "add",
        path: `${data.path}/{{snakeCase name}}/list.vue`,
        templateFile: "plop-templates/abpcrud/list.hbs",
        data: {
          relativePath,
          swaggerjson: Object.keys(showTypes.type.properties),
          showTypes: showTypes.location,
          url: showTypes.url,
          componentName: `${relativePath} ${data.name} list`,
          moduleName: data.name,
        },
      },
      {
        type: "add",
        path: `${data.path}/{{snakeCase name}}/detail.vue`,
        templateFile: "plop-templates/abpcrud/detail.hbs",
        data: {
          componentName: `${relativePath} ${data.name} detail`,
        },
      },
      {
        type: "add",
        path: `${data.path}/{{snakeCase name}}/components/DetailForm/index.vue`,
        templateFile: "plop-templates/abpcrud/form.hbs",
        data: {
          relativePath,
          swaggerjson: Object.keys(createParas.type.properties),
          createParas: createParas.location,
          url: showTypes.url,
          schemasName: data.EditProp,
          moduleName: data.name,
        },
      },
      {
        type: "add",
        path: `${data.path}/{{snakeCase name}}/components/FormMode/index.vue`,
        templateFile: "plop-templates/abpcrud/mode.hbs",
      },
    ];
    return actions;
  },
};
