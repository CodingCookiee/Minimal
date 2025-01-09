const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};

const validateName = (name) => {
  return name.length >= 5 && /^[a-zA-Z\s]+$/.test(name);
};

export const validateSignup = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters",
    });
  }

  if (!validateName(name)) {
    return res.status(400).json({
      message:
        "Name must be at least 5 characters long and contain only letters",
    });
  }

  next();
};

export const validatePasswordReset = (req, res, next) => {
  const { newPassword } = req.body;

  if (!validatePassword(newPassword)) {
    return res.status(400).json({
      message:
        "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters",
    });
  }

  next();
};
