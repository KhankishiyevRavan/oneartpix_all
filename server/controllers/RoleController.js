const Role = require("../models/Role");

// Yeni rol yaratmaq

exports.createRole = async (req, res) => {
  const { name, showName, fields, permissions } = req.body;

  try {
    // Əvvəlcə eyni adda rol varmı yoxla
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: `Bu adda rol artıq mövcuddur: ${showName}`,
      });
    }

    const rawRoles = permissions.roles;
    const roleEntries = Array.isArray(rawRoles)
      ? rawRoles
      : Object.entries(rawRoles || {}).map(([roleId, perms]) => ({
          role: roleId,
          permissions: perms,
        }));

    const userRolesPermissions = await Promise.all(
      roleEntries.map(async (permission) => {
        const role = await Role.findOne({ _id: permission.role });
        if (!role) throw new Error(`Role tapılmadı: ${permission.role}`);

        return {
          role: role._id,
          permissions: permission.permissions,
        };
      })
    );

    const finalPermissions = {
      roles: userRolesPermissions,
      contracts: permissions.contracts || {},
      users: permissions.users || {},
      finance: permissions.finance || {},
    };

    const newRole = new Role({
      name,
      showName,
      fields,
      permissions: finalPermissions,
    });

    await newRole.save();

    res.status(201).json({
      success: true,
      message: "Rol uğurla yaradıldı!",
      role: newRole,
    });
  } catch (err) {
    console.error("Rol yaradılarkən xəta:", err);
    res.status(500).json({ message: "Rol yaradılması zamanı server xətası" });
  }
};


// Rolların siyahısını gətirmək
exports.getRoles = async (req, res) => {
  try {
    // `admin` rolunu çıxarırıq
    const roles = await Role.find({ name: { $ne: "admin" } });

    res.status(200).json(roles); // Rolları göndəririk, admin olmadan
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rolları əldə edərkən server xətası" });
  }
};

// Tek bir role-u id ilə gətirmək
exports.getRoleById = async (req, res) => {
  const { id } = req.params; // URL-dən id parametrini alırıq

  try {
    // İstədiyimiz id ilə role-u tapırıq
    let role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({ message: "Rol tapılmadı" });
    }

    // password sahəsini fields-dan çıxarırıq
    const filteredFields =
      role.fields?.filter((f) => f.key !== "password") || [];

    // Role məlumatlarını geri göndəririk, amma password'u çıxarırıq
    res.status(200).json({ ...role.toObject(), fields: filteredFields });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rolu əldə edərkən server xətası" });
  }
};

// Tek bir role-u name ilə gətirmək
exports.getRoleByName = async (req, res) => {
  const { name } = req.params; // URL-dən name parametrini alırıq

  try {
    // İstədiyimiz name ilə role-u tapırıq
    const role = await Role.findOne({ name: name });
    if (!role) {
      return res.status(404).json({ message: "Rol tapılmadı" });
    }

    res.status(200).json(role); // Role məlumatlarını geri göndəririk
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rolu əldə edərkən server xətası" });
  }
};
// Rol yeniləmək
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  // const { name, showName, description, fields, permissions } = req.body;
  const { name, showName, fields, permissions } = req.body;

  try {
    // Permissions içindəki roles sahəsini formatlaşdırırıq
    const rawRoles = permissions.roles;
    const roleEntries = Array.isArray(rawRoles)
      ? rawRoles
      : Object.entries(rawRoles || {}).map(([roleId, perms]) => ({
          role: roleId,
          permissions: perms,
        }));

    const userRolesPermissions = await Promise.all(
      roleEntries.map(async (permission) => {
        const role = await Role.findOne({ _id: permission.role });
        if (!role) throw new Error(`Role tapılmadı: ${permission.role}`);

        return {
          role: role._id,
          permissions: permission.permissions,
        };
      })
    );

    // Son icazələri birləşdiririk
    const finalPermissions = {
      roles: userRolesPermissions,
      contracts: permissions.contracts || {},
      users: permissions.users || {},
      finance: permissions.finance || {},
    };

    // Rolun mövcud olub olmadığını yoxlayırıq
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return res.status(404).json({ message: "Rol tapılmadı" });
    }

    // Yeniləməni tətbiq edirik
    existingRole.name = name;
    existingRole.showName = showName;
    // existingRole.description = description;
    existingRole.fields = fields;
    existingRole.permissions = finalPermissions;

    await existingRole.save();

    res.status(200).json({
      success: true,
      message: "Rol uğurla yeniləndi!",
      role: existingRole,
    });
  } catch (err) {
    console.error("Rol yenilənərkən xəta:", err);
    res.status(500).json({ message: "Rol yenilənməsi zamanı server xətası" });
  }
};
