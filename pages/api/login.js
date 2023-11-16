// pages/api/login.js
// This is a simple example; replace it with your actual authentication logic

export default (req, res) => {
  const { username, password } = req.body;

  // Replace this with your actual authentication logic
  if (username === "your_username" && password === "your_password") {
    res.status(200).json({ message: "Login successful!" });
  } else {
    res.status(401).json({ message: "Login failed" });
  }
};
