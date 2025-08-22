const User = require("../models/User");
const Role = require("../models/Role"); // Role modelini daxil edirik
const bcrypt = require("bcryptjs"); // Parolun şifrələnməsi üçün
const ServicePackage = require("../models/ServicePackage");
const { createLog } = require("../services/logService");
const { getChangedFields } = require("../utils/utils");
exports.createUser = async (req, res) => {
  const {
    fname,
    lname,
    fathername,
    email,
    password,
    phoneNumber,
    status,
    role,
    bDate,
    identityNumber,
    dynamicFields,
    address,
  } = req.body;

  try {
    const requestingUser = req.user;

    const requesterRoleData = await Role.findById(requestingUser.roleId);
    if (!requesterRoleData) {
      return res.status(403).json({ message: "Sizin rol tapılmadı" });
    }

    const isAdmin = requesterRoleData.name === "admin";

    if (!isAdmin) {
      const permissions = requesterRoleData.permissions; // 🎯 Permissions artıq requesterRoleData-dan gəlir!

      const rolePermission = permissions.roles?.find((rp) => rp.role === role);
      if (!rolePermission || !rolePermission.permissions.create) {
        return res
          .status(403)
          .json({ message: "İstifadəçi yaratmağa icazəniz yoxdur" });
      }
    }

    const roleData = await Role.findById(role);
    if (!roleData) {
      return res.status(400).json({ message: "Role not found" });
    }

    let errors = {};

    if (email) {
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        errors.email = "Bu e-poçt artıq istifadə olunur";
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const newUser = new User({
      fname,
      lname,
      fathername,
      email,
      password,
      phoneNumber,
      dynamicFields,
      identityNumber,
      status,
      role,
      address,
      bDate,
    });

    await newUser.save();
    await createLog({
      userId: req.user?._id,
      operation: "create",
      entityType: "User",
      entityId: newUser._id,
      details: newUser.toObject(),
    });
    res.status(201).json({
      success: true,
      message: "İstifadəçi uğurla yaradıldı!",
      user: newUser,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res
      .status(500)
      .json({ message: "İstifadəçi yaradılması zamanı server xətası" });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const requestingUser = req.user; // Token-dən gələn istifadəçi məlumatı
    // console.log(requestingUser);

    // Əgər öz məlumatını çəkirsə, icazə yoxlamasına ehtiyac yoxdur:
    const isSelf = requestingUser.userId === userId;
    if (!isSelf) {
      const requesterRoleData = await Role.findById(requestingUser.roleId);
      if (!requesterRoleData) {
        return res.status(403).json({ message: "Sizin rol tapılmadı" });
      }
      const isAdmin = requesterRoleData.name === "admin";

      if (!isAdmin) {
        const permissions = requesterRoleData.permissions;

        const hasReadPermission = permissions.roles?.some(
          (rp) => rp.permissions.read
        );
        if (!hasReadPermission) {
          return res.status(403).json({
            message: "İstifadəçi məlumatını görmək icazəniz yoxdur",
          });
        }
      }
    }

    const user = await User.findById(userId).populate("role", "name");
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    res.status(200).json({
      success: true,
      user: {
        identityNumber: user.identityNumber,
        fname: user.fname,
        lname: user.lname,
        fathername: user.fathername,
        email: user.email,
        bDate: user.bDate,
        phoneNumber: user.phoneNumber,
        status: user.status,
        role: user.role?._id || null,
        roleName: user.role?.name || null,
        dynamicFields: user.dynamicFields,
        balance: user.balance,
        address: user.address,
        _id: user._id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "İstifadəçinin götürülməsi zamanı server xətası",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const requesterRole = await Role.findById(req.user.roleId);

    if (!requesterRole) {
      return res.status(403).json({ message: "İstifadəçinin rolu tapılmadı" });
    }

    let users = [];

    if (requesterRole.name === "admin") {
      users = await User.find({ _id: { $ne: req.user.userId } }).populate(
        "role"
      );
    } else {
      const permissionsRoles = requesterRole.permissions.roles || [];
      const readableRoleIds = permissionsRoles
        .filter((p) => p.permissions?.read)
        .map((p) => p.role.toString());

      if (readableRoleIds.length === 0) {
        return res.status(200).json({ success: true, users: [] });
      }

      users = await User.find({
        role: { $in: readableRoleIds },
      }).populate("role");
    }

    // 🔁 Hər bir user üçün müqavilələri tap
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const userContracts = await Contract.find({
          subscriberId: user._id,
        }).select("contractNumber"); // Sadəcə contractNumber çəkirik

        const contractNames = userContracts.map((c) => c.contractNumber);

        return {
          identityNumber: user.identityNumber,
          fname: user.fname,
          lname: user.lname,
          fathername: user.fathername,
          phoneNumber: user.phoneNumber,
          email: user.email,
          bDate: user.bDate,
          role: user.role?.name,
          status: user.status,
          _id: user._id,
          address: user.address,
          contracts: contractNames, // 🆕 Əlavə etdik
        };
      })
    );

    return res.status(200).json({
      success: true,
      users: enrichedUsers,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "İstifadəçilərin götürülməsi zamanı server xətası" });
  }
};

exports.getUsersByRole = async (req, res) => {
  const { roleName } = req.params;

  try {
    const role = await Role.findOne({ name: roleName });

    if (!role) {
      return res.status(400).json({ message: "Rol tapılmadı!" });
    }

    // Bu role sahib istifadəçiləri tapırıq və onların rolunu `populate` ilə daxil edirik
    const users = await User.find({ role: role._id }).populate("role");

    res.status(200).json({
      success: true,
      users: users.map((user) => ({
        fname: user.fname,
        lname: user.lname,
        fathername: user.fathername,
        email: user.email,
        bDate: user.bDate,
        phoneNumber: user.phoneNumber,
        _id: user.id,
        role: role._id, // `role.name` olaraq rolun adını alırıq
        status: user.status,
        address: user.address,
      })),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "İstifadəçiləri rola görə gətirərkən server xətası" });
  }
};
// Redaktə etmək (edit) üçün metod
exports.editUser = async (req, res) => {
  const { userId } = req.params;
  const {
    fname,
    lname,
    fathername,
    email,
    bDate,
    status,
    dynamicFields,
    phoneNumber,
    identityNumber,
    role,
    address,
  } = req.body;

  try {
    const requestingUser = req.user;
    const user = await User.findById(userId);
    const oldData = user.toObject();
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const isSelf = requestingUser.id === userId;
    if (!isSelf) {
      const requesterRoleData = await Role.findById(requestingUser.roleId);
      if (!requesterRoleData) {
        return res.status(403).json({ message: "Sizin rol tapılmadı" });
      }

      const isAdmin = requesterRoleData.name === "admin";

      if (!isAdmin) {
        const permissions = requesterRoleData.permissions;

        // user-in hazırkı roluna görə edit icazəsini yoxla:
        const userRoleId = String(user.role);
        const rolePermission = permissions.roles?.find(
          (rp) => rp.role === userRoleId
        );

        if (!rolePermission || !rolePermission.permissions.edit) {
          return res.status(403).json({
            message: "Bu istifadəçini redaktə etmək icazəniz yoxdur",
          });
        }
      }
    }

    // İstifadəçi məlumatlarını yeniləyirik
    user.fname = fname || user.fname;
    user.lname = lname || user.lname;
    user.fathername = fathername || user.fathername;
    user.email = email || user.email;
    user.bDate = bDate || user.bDate;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.role = role || user.role;
    user.status = typeof status === "boolean" ? status : user.status;
    user.dynamicFields = dynamicFields || user.dynamicFields;
    user.identityNumber = identityNumber || user.identityNumber;
    user.address = address || user.address;

    await user.save();
    const { before, after } = getChangedFields(oldData, user.toObject());

    await createLog({
      userId: req.user?._id,
      operation: "update",
      entityType: "User",
      entityId: user._id,
      details: { before, after },
    });
    res.status(200).json({
      success: true,
      message: "İstifadəçi uğurla yeniləndi!",
      user,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ message: "İstifadəçi yeniləməsi zamanı server xətası" });
  }
};

// Silmək (delete) üçün metod
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const targetUser = await User.findById(userId); // silinəcək user

    if (!targetUser) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    const currentUser = req.user; // token-dən gələn user

    // Əgər admin deyilsə və delete icazəsi yoxdursa, qadağan et

    await User.findByIdAndDelete(userId);
    await createLog({
      userId: req.user?._id,
      operation: "delete",
      entityType: "User",
      entityId: targetUser._id,
      details: targetUser.toObject(),
    });
    res.status(200).json({
      success: true,
      message: "İstifadəçi uğurla silindi!",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res
      .status(500)
      .json({ message: "İstifadəçinin silinməsi zamanı server xətası" });
  }
};
// Yeni metod
const Contract = require("../models/Contract");

exports.getUserNameById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .select("fname lname role")
      .populate("role", "name");

    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }

    // 🔐 1. Əgər admin-dirsə, davam et
    const isAdmin = req.user.role === "admin";

    // 🔐 2. Admin deyilsə, icazə yoxla
    let hasPermission = false;
    if (!isAdmin) {
      const requesterRole = await Role.findById(req.user.roleId);
      if (!requesterRole) {
        return res.status(403).json({ message: "Rolu tapmaq mümkün olmadı" });
      }
      hasPermission = requesterRole.permissions?.read === true;
      if (!hasPermission) {
        return res.status(403).json({ message: "İcazəniz yoxdur" });
      }
    }

    // 📄 3. Müqavilələri tap (contract.subscriberId = user._id)
    const contracts = await Contract.find({ subscriberId: userId }).select(
      "servicePackage"
    );

    // 📦 4. Xidmət paketlərini tap (unikal ID-lərdən)
    const packageIds = contracts.map((c) => c.servicePackage).filter(Boolean);
    const servicePackages = await ServicePackage.find({
      _id: { $in: packageIds },
    }).select("name totalPrice validity status");

    // ✅ 5. Məlumatı qaytar
    return res.status(200).json({
      success: true,
      user: {
        fname: user.fname,
        lname: user.lname,
        packages: servicePackages,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xətası" });
  }
};
exports.getTechnicianUsers = async (req, res) => {
  try {
    // 1. "usta" rolunu tapırıq
    const role = await Role.findOne({ name: "usta" });

    // Əgər rol tapılmazsa, boş array qaytar
    if (!role) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    // 2. Bu rola sahib istifadəçiləri tapırıq
    const users = await User.find({ role: role._id }).select(
      "fname lname email status"
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("Ustalar tapılarkən xəta:", err);
    res.status(500).json({ message: "Server xətası" });
  }
};
