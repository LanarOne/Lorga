import Role from "../models/Role.js";

async function initializeRoles() {
  const roles = [
    `invité`,
    `artiste`,
    `artiste dans un collectif`,
    `admin d'un collectif`,
    `créateur d'un collectif`,
    `LorgÄdmin`,
    `5upaÄadmin`,
  ];
  for (const name of roles) {
    await Role.findOrCreate({ where: { name }, defaults: { name } });
  }
}
export default initializeRoles;
