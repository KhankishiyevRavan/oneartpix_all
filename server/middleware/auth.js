const jwt = require("jsonwebtoken");
const { Role } = require("../models/Role");

// Token yoxlama middleware-i
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token yoxdur və ya düzgün deyil" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token etibarsızdır" });
  }
};

module.exports = authMiddleware;


// İcazə yoxlama middleware-i
// const Permission = require("../models/Permission");

// const requirePermission = (permissionName) => {
//   return async (req, res, next) => {
//     try {
//       const user = req.user;

//       if (!user || !user.permissions || user.permissions.length === 0) {
//         return res.status(403).json({ message: "Permission denied" });
//       }

//       const permission = await Permission.findOne({ name: permissionName });

//       if (!permission) {
//         return res.status(404).json({ message: "Permission not found" });
//       }

//       const hasPermission = user.permissions.includes(permission._id.toString());

//       if (!hasPermission) {
//         return res.status(403).json({ message: "Permission denied" });
//       }

//       next();
//     } catch (err) {
//       console.error("Permission check error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
// };

// module.exports = {
//   requirePermission,
// };



const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userRoleId = req.user.role;

      const role = await Role.findByPk(userRoleId);

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      if (!allowedRoles.includes(role.name)) {
        return res
          .status(403)
          .json({ message: "Access denied: Not allowed role" });
      }

      // Əgər əlavə olaraq permission yoxlamaq istəsən (əlavədir):
      // const permissions = await RolePermission.findAll({
      //   where: { role_id: role.id },
      //   include: [{ model: Permission }],
      // });
      // const permissionNames = permissions.map(p => p.Permission.name);
      // if (!permissionNames.includes("createRole")) {
      //   return res.status(403).json({ message: "Access denied: No permission" });
      // }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error in role check" });
    }
  };
};
module.exports = {
  authMiddleware,
  // requirePermission,
  requireRole,
};
