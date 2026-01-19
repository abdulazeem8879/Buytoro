const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>© {new Date().getFullYear()} BuyToro. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

const footerStyle = {
  marginTop: "40px",
  padding: "20px",
  textAlign: "center",
  background: "#f4f4f4",
};

