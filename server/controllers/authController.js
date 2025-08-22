const dotenv = require("dotenv");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

dotenv.config();

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const validateUserCredentials = require("../utils/validateFields");
const handleValidationErrors = require("../utils/handleValidationErrors");

// Регистрация
exports.register = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    const validationError = handleValidationErrors(res, message, errors, 400);
    if (validationError) return;

    const newUser = new User({
      username,
      email,
      password,
      mobileNumber,
      role: "user",
    });
    await newUser.save();

    // Генерируем токен
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(201)
      .json({ success: true, token, user: { username, role: newUser.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xəta" });
  }
};

// Логин
// Login
const axios = require("axios");

// reCAPTCHA doğrulama funksiyası
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  const response = await axios.post(url);
  return response.data.success;
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // İstifadəçi yoxlanışı
  const { authErrors, user } = await validateUserCredentials(email, password);
  const authError = handleValidationErrors(res, authErrors, 401);
  if (authError) return;

  if (user.status === false) {
    return res
      .status(403)
      .json({ message: "Giriş məhdudlaşdırılıb" });
  }

  try {
    const populatedUser = await User.findById(user._id).populate("role");

    if (!populatedUser || !populatedUser.role) {
      return res
        .status(400)
        .json({ message: "İstifadəçinin rol məlumatı tapılmadı" });
    }

    const tokenPayload = {
      userId: populatedUser._id,
      email: populatedUser.email,
      role: populatedUser.role.name,
      roleId: populatedUser.role._id,
      permissions: populatedUser.permissions,
      balance: populatedUser.balance,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
      })
      .status(200)
      .json({
        token: accessToken,
        user: {
          id: populatedUser._id,
          email: populatedUser.email,
          role: populatedUser.role.name,
          roleId: populatedUser.role._id,
          permissions: populatedUser.permissions,
          balance: populatedUser.balance,
        },
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Daxil olma zamanı xəta baş verdi" });
  }
};


// Отправка ссылку на email
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Не сообщаем, существует ли email — ради безопасности
      return res
        .status(200)
        .json({ message: "Əgər bu e-poçt ünvanı varsa, sıfırlama linki göndərilib." });
    }

    // Генерация токена и установка времени действия
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 минут

    await user.save();

    // const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    // const message = `Click the following link to reset your password:\n${resetLink}\nThis link is valid for 15 minutes.`;
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <p><strong> Hörmətli İstifadəçi,</strong></p>
      <p>Bu linkə tıklayaraq yeni şifrə təyin edə bilərsiniz:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Bu link 15 dəqiqə etibarlıdır.</p>
      <hr />
      <p><strong> Hörmətlə, «MEDİ GROUP» MMC-ın İT departamenti. </strong></p>
      <p>Şirkət: <strong>«MEDİ GROUP» MMC</strong><br />
      VÖEN: <strong>1202027011</strong><br />
      Əlaqə: <a href="tel:+994502719956"><strong>+994 50 271 99 56 </strong></a><br />
      Sayt: <a href="https://www.kombim.az" target="_blank"><strong>www.kombim.az</strong></a>
      </p>
`;

    await sendEmail(user.email, "Şifrə bərpa proseduru", null, html);

    // await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error sending reset email." });
  }
};

// Сброс пароля
exports.resetPasswordWithToken = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // проверка на истечение
    });

    if (!user) {
      return res.status(400).json({ message: "Sessiya xətası" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Şifrəniz uğurla yeniləndi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Şifrə yeniləmə zamanı xəta baş verdi" });
  }
};
// Refresh token endpoint
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "Refresh token yoxdur" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).populate("role");
    if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role.name,
      roleId: user.role._id,
      permissions: user.permissions,
      balance: user.balance,
    };

    const newAccessToken = jwt.sign(
      tokenPayload,
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Refresh token etibarsızdır" });
  }
};
