const User = require("../models/User");

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res) => {
    // tạo user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      // Mật khẩu được mã hóa bằng thuật toán AES từ thư viện crypto-js, với SECRET_KEY từ biến môi trường.
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
    });
    try {
      await newUser.save();
      res.status(201).json({ measage: "user successfully created" });
      // console.log(req.body);
    } catch (error) {
      res.status(500).json({ measage: error });
    }
  },
  loginUser: async (req, rs) => {
    try {
      //  tìm kiếm trong cơ sở dữ liệu người dùng có email phù hợp với email được gửi trong yêu cầu (request).
      const user = await User.findOne({ email: req.body.email });
      // nếu không tìm thấy người dùng, trả về mã trạng thái 401 và thông báo lỗi.
      if (!user) {
        rs.status(401).json("Wrong credentials provide a valid emmail");
      }
      // Nếu tìm thấy người dùng, hàm tiếp tục giải mã mật khẩu đã được mã hóa của người dùng
      //  bằng cách sử dụng SECRET_KEY.
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      );
      // Chuyển đổi mật khẩu đã giải mã thành chuỗi.
      const decryptedPass = decryptedPassword.toString(CryptoJS.enc.Utf8);
      // So sánh mật khẩu đã giải mã với mật khẩu được gửi trong yêu cầu. Nếu chúng không khớp, hàm sẽ trả về lỗi 401 với thông báo "Wrong password".
      if (decryptedPass !== req.body.password) {
        return rs.status(401).json("Wrong passord");
      }
      // tạo một token JWT (JSON Web Token) cho người dùng.
      // jwt.sign là một hàm tạo token
      // token được tạo ra bằng hàm jwt.sign và được sử dụng để xác thực người dùng.
      // Payload của token bao gồm id của người dùng, và token này sẽ hết hạn sau 7 ngày ({expiresIn: "7d"}
      const userToken = jwt.sign(
        {
          // với payload là { id: user._id }
          id: user._id,
        },
        process.env.JWT_SEC,
        { expiresIn: "7d" }
      );
      // tạo ra một đối tượng mới userData từ user._doc
      //  nhưng loại bỏ các trường password, __v, createAt, updateAt. user._doc
      // chứa thông tin về người dùng lấy từ cơ sở dữ liệu MongoDB
      // userData chứa tất cả các trường của user._doc ngoại trừ password, __v, createAt, updateAt
      const { password, __v, createdAt, updatedAt, ...userData } = user._doc;
      // spread trong JavaScript, nó tạo ra một đối tượng mới từ userData và thêm vào trường token với giá trị là userToken.
      rs.status(200).json({ ...userData, token: userToken });
    } catch (error) {
      rs.status(500).json({ measage: error });
    }
  },
};
