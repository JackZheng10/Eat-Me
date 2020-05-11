const helloWorld = (req, res) => {
  return res.json({ success: true, message: "Hello world!" });
};

module.exports = { helloWorld };
