

const bcrypt = require("bcrypt");

const User = require('../model/User');

const UserRegister = async (req, res) => {
  const { username, password, mobile } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide username and password",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      mobile,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



const UserLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        mobile: user.mobile,
      },
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};



module.exports = { UserRegister, UserLogin };